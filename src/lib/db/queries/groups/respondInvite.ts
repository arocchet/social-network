import { db } from "@/lib/db";
// No NextResponse here; helper returns plain objects or throws
// TODO : Potentiellement modifier la logique pour s'aligner avec le reste
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

// No DECLINED enum in InvitationStatus. We avoid updating status for REJECT.

async function addUserToGroupIfNotExists(userId: string, groupId: string) {
  await db.conversationMember.upsert({
    where: { userId_conversationId: { userId, conversationId: groupId } },
    update: {},
    create: { conversationId: groupId, userId },
  });
}

export async function respondInvite(data: RespondInput) {
  const { userId, requestId, action, groupId } = data;

  if (!(await isGroupOwner(userId, groupId))) {
    throw new Error("Unauthorized");
  }

  const request = await getInvitation(requestId, groupId);
  if (!request) {
    throw new Error("Invalid request");
  }

  if (action === "ACCEPT") {
    await addUserToGroupIfNotExists(request.invitedId, groupId);
    await db.groupInvitation.delete({ where: { id: requestId } });
    return { message: "Request accepted" };
  }

  // REJECT: simply delete the invitation (no DECLINED state in DB)
  await db.groupInvitation.delete({ where: { id: requestId } });
  return { message: "Request declined" };
}
