import { db } from "@/lib/db";

type Params = {
    friendshipId: string;
    status?: "pending" | "accepted" | "rejected";
};

export async function updateFriendship(params: Params) {
    try {
        const friendship = await db.friendship.update({
            // Update the friendship status if provided
            data: {
                status: params.status,
            },
            where: {
                id: params.friendshipId,
            },
            select: {
                id: true,
                userId: true,
                friendId: true,
                status: true,
                createdAt: true,
            },
        });

        return friendship;
    } catch (err) {
        console.error("Error get friendship:", err);
        throw new Error(
            err instanceof Error ? err.message : "Unexpected server error"
        );
    }
}
