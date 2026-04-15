import { respondInvite } from "@/lib/db/queries/groups/respondInvite";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";

function isValidAction(action: string) {
  return ["ACCEPT", "REJECT"].includes(action);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    const { id: groupId } = await params;
    const { requestId, action } = await req.json();

    if (!userId) {
      return NextResponse.json(respondError("Not authenticated"), { status: 401 });
    }

    if (!isValidAction(action)) {
      return NextResponse.json(respondError("Invalid action"), { status: 400 });
    }

    const response = await respondInvite({ userId, requestId, action, groupId });
    return NextResponse.json(respondSuccess(response, "Invitation updated"), { status: 200 });

  } catch (err) {
    console.error("Respond invite error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    const status =
      message === "Unauthorized" ? 403 : message === "Invalid request" ? 400 : 500;
    return NextResponse.json(respondError(message), { status });
  }
}
