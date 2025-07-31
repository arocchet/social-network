import { db } from "@/lib/db";
import { serializeDates } from "@/lib/utils/serializeDates";

import { ZodSchema, z } from "zod";

export async function getUserByIdServer<T>(
    userId: string,
    schema: ZodSchema<T>
): Promise<T | null> {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                banner: true,
                biography: true,
                lastName: true,
                birthDate: true,
                firstName: true,
                visibility: true,
                friendsWithMe: true,
            },
        });

        if (!user) return null;


        return serializeDates(user);
    } catch (error) {
        console.error("Database error in getUserByIdServer:", error);
        throw new Error("Failed to fetch user data");
    }
}


//TODO