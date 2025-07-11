import { db } from "@/lib/db";

interface GroupDetails {
  userIds: string[],
  title: string,
  ownerId: string,
}

export async function createGroupInDb(data : GroupDetails){

    const {userIds, title, ownerId} = data;

    if (!userIds.includes(ownerId)) {
      userIds.push(ownerId);
    }

    const group = await db.conversation.create({
      data: {
        title,
        isGroup: true,
        ownerId,
        members: {
          create: userIds.map((id) => ({
            user: { connect: { id } },
          })),
        },
      },
      include: {
        members: { include: { user: true } },
      },
    });

   return group;
}
