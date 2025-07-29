import { db } from "@/lib/db";

type Params = {
    followId: string;
    userId: string;
    status?: "pending" | "accepted" | "rejected";
};

export async function deleteFriendshipInDb(params: Params) {
    try {
        await db.friendship.delete({
            where: {
                userId_friendId: {
                    userId: params.userId,
                    friendId: params.followId,
                },  
            },
        });

        return null;
    } catch (err) {
        console.error("Error deleting friendship:", err);
        throw new Error(
            err instanceof Error ? err.message : "Unexpected server error"
        );
    }
}
