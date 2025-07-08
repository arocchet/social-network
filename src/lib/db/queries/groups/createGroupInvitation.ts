import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function createGroupInvitation(
  groupId: string,
  inviterId: string,
  invitedId: string
) {
  if (inviterId === invitedId) {
    throw new Error("Vous ne pouvez pas vous inviter vous-même.");
  }

  const group = await db.conversation.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    throw new Error("Groupe introuvable.");
  }

  if (group.ownerId !== inviterId) {
    throw new Error("Non autorisé à inviter dans ce groupe.");
  }

  try {
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
        message: `You have been invited to join the group "${group.title || "Unnamed Group"}".`,
      },
    });

    return invitation;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("L'utilisateur a déjà été invité.");
    }
    throw error;
  }
}
