import { db } from "@/lib/db";

type Params = {
    notificationId: string;
    isread: boolean;
};

export async function updateNotificatons(params: Params) {
    try {
        const friendship = await db.notification.update({
            // Update the friendship status if provided
            data: {
                isRead: params.isread,
            },
            where: {
                id: params.notificationId,
            },
            select: {
                id: true,
                userId: true,
                type: true,
                message: true,
                createdAt: true,
                isRead: true,

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
