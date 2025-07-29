import { db } from "@/lib/db";

type Params = {
  followId: string;
  userId: string;
};

export async function checkFriendshipInDb(params: Params) {
  try {
    const newFriendship = await db.friendship.findFirst({
        where: {
            userId: params.userId,
            friendId: params.followId,
        },  
      select: {
        userId: true,
        friendId: true,
        status: true,
      },
    });

    return newFriendship;
  } catch (err) {
    console.error("Error get friendship:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unexpected server error"
    );
  }
}
