import { db } from "@/lib/db";

type Params = {
    userId: string;
};

export async function countFollow(params: Params) {
    try {
        const follower = await db.friendship.count({
            where: {
               friendId: params.userId,
            },
        });

        const following = await db.friendship.count({
            where: {
                 userId: params.userId,
            },
        });
        
        return {follower, following};
    } catch (err) {
        console.error("Error count friendship:", err);
        throw new Error(
            err instanceof Error ? err.message : "Unexpected server error"
        );
    }
}
