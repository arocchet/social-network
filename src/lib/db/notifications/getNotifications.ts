import { db } from "@/lib/db";

type Params = {
    userId: string;
    date?: Date;
};

export async function getNotificationByUserId(params: Params) {
    try {
        const notifications = await db.notification.findMany({
            where: {
                id: params.userId,
                createdAt: {
                    gte: params.date || new Date(0),
                },

            },
            orderBy: {
                createdAt: "desc",
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

        return notifications;
    } catch (err) {
        console.error("Error get notifications:", err);
        throw new Error(
            err instanceof Error ? err.message : "Unexpected server error"
        );
    }
}
