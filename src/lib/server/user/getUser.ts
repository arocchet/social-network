// lib/server/user/getUserById.ts
import { db } from "@/lib/db";
import { UserInfoProfile } from "@/lib/types/types";
import { UserInfoProfileSchema } from "@/lib/validations/userValidation";

export async function getUserByIdServer(userId: string): Promise<UserInfoProfile | null> {
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
            },
        });

        if (!user) return null;

        const userWithStringDate = {
            ...user,
            birthDate: user.birthDate ? user.birthDate.toISOString() : null,
        };

        return UserInfoProfileSchema.parse(userWithStringDate);

    } catch (error) {
        console.error("Database error in getUserByIdServer:", error);
        throw new Error("Failed to fetch user data");
    }
}