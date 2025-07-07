import { db } from "@/lib/db";

type Params = {
  followId: string;
  userId: string;
  status?: "pending" | "accepted" | "rejected";
};

export async function createFriendshipInDb(params: Params) {
  try {
    const newFriendship = await db.friendship.create({
      data: {
        userId: params.userId,
        friendId: params.followId,
        status: params.status || "pending",
      },
      select: {
        userId: true,
        friendId: true,
        status: true,
      },
    });

    return newFriendship;
  } catch (err) {
    console.error("Error creating friendship:", err);
    throw new Error(
      err instanceof Error ? err.message : "Unexpected server error"
    );
  }
}
