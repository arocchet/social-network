// pages/api/groups/[id]/join.ts

import { NextRequest, NextResponse } from "next/server";
import {
  respondJoinRequest,
  ActionType,
} from "@/lib/db/queries/groups/respondRequest";

function isValidAction(action: string): action is ActionType {
  return ["ACCEPT", "REJECT"].includes(action);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const { id: groupId } = await params;
    const { requestId, action } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!isValidAction(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await respondJoinRequest({
      userId,
      groupId,
      requestId,
      action,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Join request error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    const status =
      message === "Unauthorized"
        ? 403
        : message === "Invalid request"
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
