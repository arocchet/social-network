import { db } from "@/lib/db";
import { InvitationStatus } from "@prisma/client";
import { NextResponse } from "next/server";

interface RespondInput {
  userId: string;
  requestId: string;
  action: string;
  groupId: string;
}

async function isGroupOwner(userId: string, groupId: string) {
  const group = await db.conversation.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== userId) return false;
  return true;
}

async function getInvitation(requestId: string, groupId: string) {
  const request = await db.groupInvitation.findUnique({
    where: { id: requestId },
  });
  if (!request || request.groupId !== groupId) return null;
  return request;
}

async function updateInvitationStatus(requestId: string, action: string) {
  const status =
    action === "ACCEPT" ? InvitationStatus.ACCEPTED : InvitationStatus.DECLINED;
  return db.groupInvitation.update({
    where: { id: requestId },
    data: { status },
  });
}

async function addUserToGroupIfNotExists(userId: string, groupId: string) {
  const exists = await db.conversationMember.findUnique({
    where: { userId_conversationId: { userId, conversationId: groupId } },
  });

  if (!exists) {
    await db.conversationMember.create({
      data: { conversationId: groupId, userId },
    });
  }
}

export async function respondInvite(data: RespondInput) {
  const { userId, requestId, action, groupId } = data;

  if (!(await isGroupOwner(userId, groupId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const request = await getInvitation(requestId, groupId);
  if (!request) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated = await updateInvitationStatus(requestId, action);

  if (action === "ACCEPT") {
    await addUserToGroupIfNotExists(updated.invitedId, groupId);
  }

  if (["ACCEPT", "REJECT"].includes(action)) {
    await db.groupInvitation.delete({ where: { id: requestId } });
  }

  return NextResponse.json({
    message: `Request ${action === "ACCEPT" ? "accepted" : "declined"}`,
  });
}
