import { db } from "@/lib/db";

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
            },
        });

        if (!user) return null;

        const parsed = schema.parse({
            ...user,
            birthDate: user.birthDate ? user.birthDate.toISOString() : null,
        });

        return parsed;
    } catch (error) {
        console.error("Database error in getUserByIdServer:", error);
        throw new Error("Failed to fetch user data");
    }
}


//TODO