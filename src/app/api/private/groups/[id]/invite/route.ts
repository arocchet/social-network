import { NextRequest, NextResponse } from "next/server";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { createGroupInvitation } from "@/lib/db/queries/groups/createGroupInvitation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const inviterId = req.headers.get("x-user-id");
    const { id: groupId } = await params;
    const { invitedId } = await req.json();

    if (!inviterId) {
      return NextResponse.json(respondError("Missing or invalid user ID"), { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json(respondError("Group ID is required"), { status: 400 });
    }

    if (!invitedId) {
      return NextResponse.json(respondError("Invited user ID is required"), { status: 400 });
    }

    if (inviterId === invitedId) {
      return NextResponse.json(respondError("Inviter cannot invite himself"), { status: 401 });
    }

    const data = {
      groupId,
      inviterId,
      invitedId,
    };

    const invitation = await createGroupInvitation(data);

    return NextResponse.json(respondSuccess(invitation, "Invitation sent"), { status: 200 });

  } catch (err) {
    console.error("POST: api/public/groups/[id]/invite/ Failed to create invite: ", err);

    return NextResponse.json(
      respondError(err instanceof Error ? err.message : "Unexpected error"),
      { status: 500 }
    );
  }
}
