import { db } from "@/lib/db";

type Params = {
    userId: string;
    date?: Date;
    message?: string;
};

export async function postNotificationByUserId(params: Params) {
    try {
        const notification = await db.notification.create({
            data: {
                userId: params.userId,
                type: "NEW_NOTIFICATION",
                message: params.message || "You have a new notification",
                createdAt: params.date || new Date(),
                isRead: false,
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

        return notification;
    } catch (err) {
        console.error("Error get notifications:", err);
        throw new Error(
            err instanceof Error ? err.message : "Unexpected server error"
        );
    }
}


