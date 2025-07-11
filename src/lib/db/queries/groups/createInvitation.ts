import { db } from "@/lib/db";

interface CreateGroupInvitation {
  groupId: string;
  inviterId: string;
  invitedId: string;
}

export async function createInvitation(data: CreateGroupInvitation) {
  const { groupId, inviterId, invitedId } = data;

  const group = await db.conversation.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Group not found.");
  }

  if (group.ownerId !== inviterId) {
    throw new Error("Not authorized to invite in this group.");
  }

  const invitation = await db.groupInvitation.create({
    data: {
      groupId,
      inviterId,
      invitedId,
    },
  });

  await db.notification.create({
    data: {
      userId: invitedId,
      type: "GROUP_INVITATION",
      message: `You have been invited to join the group "${
        group.title || "Unnamed Group"
      }".`,
    },
  });

  return invitation;
}
