import { NextRequest, NextResponse } from "next/server";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { createGroupInvitation } from "@/lib/db/queries/groups/createGroupInvitation";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inviterId = req.headers.get("x-user-id");
    const { id: groupId } = params;

    if (!inviterId) {
      return NextResponse.json(respondError("Missing or invalid user ID"), { status: 401 });
    }

    if (!groupId) {
      return NextResponse.json(respondError("Group ID is required"), { status: 400 });
    }

    const { invitedId } = await req.json();

    if (!invitedId) {
      return NextResponse.json(respondError("Invited ID is required"), { status: 400 });
    }

    const invitation = await createGroupInvitation( groupId, inviterId, invitedId);
    
    return NextResponse.json(respondSuccess(invitation, "Invitation sent"), { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(respondError("User already invited."), { status: 409 });
    }
    return NextResponse.json(respondError(error.message || "Server error"), { status: 500 });
  }
}