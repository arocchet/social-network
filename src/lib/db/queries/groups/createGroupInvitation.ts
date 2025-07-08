
import { db } from "@/lib/db";


export async function createGroupInvitation(
  groupId: string,
  inviterId: string,
  invitedId: string
) {
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
        message: `You have been invited to join a group.`,
      },
    });
  return invitation;
}