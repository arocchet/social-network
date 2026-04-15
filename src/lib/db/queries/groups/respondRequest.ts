// lib/server/groups/respondJoinRequest.ts

import { db } from "@/lib/db";

export type ActionType = "ACCEPT" | "REJECT";

export interface RespondJoinInput {
  userId: string;
  groupId: string;
  requestId: string;
  action: ActionType;
}

export async function respondJoinRequest(data : RespondJoinInput) {
  
  const {
  userId,
  groupId,
  requestId,
  action,
} =  data;

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

  if (action === "ACCEPT") {
    await db.conversationMember.upsert({
      where: {
        userId_conversationId: {
          userId: request.seeker,
          conversationId: groupId,
        },
      },
      update: {},
      create: { conversationId: groupId, userId: request.seeker },
    });
    await db.groupJoinRequest.delete({ where: { id: requestId } });
    return { message: "Request accepted" };
  }

  // REJECT: simply delete the join request (no DECLINED status in enum)
  await db.groupJoinRequest.delete({ where: { id: requestId } });
  return { message: "Request declined" };
}
