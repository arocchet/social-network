// lib/server/groups/respondJoinRequest.ts

import { db } from "@/lib/db";
import { InvitationStatus } from "@prisma/client";

export type ActionType = "ACCEPT" | "REJECT";

export interface RespondJoinInput {
  userId: string;
  groupId: string;
  requestId: string;
  action: ActionType;
}

export async function respondJoinRequest({
  userId,
  groupId,
  requestId,
  action,
}: RespondJoinInput) {
  const group = await db.conversation.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== userId) {
    throw new Error("Unauthorized");
  }

  const request = await db.groupJoinRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.groupId !== groupId) {
    throw new Error("Invalid request");
  }

  const updated = await db.groupJoinRequest.update({
    where: { id: requestId },
    data: {
      status:
        action === "ACCEPT"
          ? InvitationStatus.ACCEPTED
          : InvitationStatus.DECLINED,
    },
  });

  if (action === "ACCEPT") {
    const exists = await db.conversationMember.findUnique({
      where: {
        userId_conversationId: {
          userId: updated.seeker,
          conversationId: groupId,
        },
      },
    });

    if (!exists) {
      await db.conversationMember.create({
        data: { conversationId: groupId, userId: updated.seeker },
      });
    }
  }

  await db.groupJoinRequest.delete({ where: { id: requestId } });

  return {
    message: `Request ${action === "ACCEPT" ? "accepted" : "declined"}`,
  };
}
