import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { InvitationStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("x-user-id");
  const groupId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { requestId, action } = await req.json();

  if (!["ACCEPT", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const group = await db.conversation.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const request = await db.groupInvitation.findUnique({ where: { id: requestId } });
  if (!request || request.groupId !== groupId) {
    return NextResponse.json({ error: "Demande invalide" }, { status: 400 });
  }

  const updated = await db.groupInvitation.update({
    where: { id: requestId },
    data: {
      status:
        action === "ACCEPT"
          ? InvitationStatus.ACCEPTED
          : InvitationStatus.DECLINED,
    },
  });

  if (action === "ACCEPT") {
    const alreadyMember = await db.groupMember.findFirst({
      where: {
        groupId,
        userId: updated.invitedId,
      },
    });

    if (!alreadyMember) {
      await db.groupMember.create({
        data: {
          groupId,
          userId: updated.invitedId,
        },
      });
    }
  }

  return NextResponse.json({
    message: `Demande ${action === "ACCEPT" ? "acceptée" : "rejetée"}`,
  });
}
