// lib/server/user/getUserById.ts
import { db } from "@/lib/db"; // Votre connexion à la base de données
import { UserInfo } from "@/lib/validations/userValidation";

export async function getUserByIdServer(userId: string): Promise<UserInfo | null> {
    try {
        // Exemple avec Prisma
        const user = await db.user.findUnique({
            where: { id: userId! },
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
                // N'inclure le password que si nécessaire pour la validation
                // password: false, // Exclure par défaut
            },
        });

        return user;

    } catch (error) {
        console.error("Database error in getUserByIdServer:", error);
        throw new Error("Failed to fetch user data");
    }
}
