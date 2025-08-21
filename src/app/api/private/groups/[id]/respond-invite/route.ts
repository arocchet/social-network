import { respondInvite } from "@/lib/db/queries/groups/respondInvite";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

function isValidAction(action: string) {
  return ["ACCEPT", "REJECT"].includes(action);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const response = await respondInvite({ userId, requestId, action, groupId });
    return NextResponse.json(respondSuccess(response, "Invitation updated"), { status: 200 });

  } catch (err) {
    console.error("POST api/groups/[id]/events error:", err);
    return NextResponse.json(
      respondError(err instanceof Error ? err.message : "Unexpected error"),
      { status: 500 }
    );
  }
}
