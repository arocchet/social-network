// app/api/private/user/[userId]/route.ts
import { UserPublic, UserSchema, UserSchemas } from "@/lib/schemas/user";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        // Get current user from session/cookies instead of header
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }
        const { params } = context;
        const { userId: targetUserId } = await params;  // await sur params entier


        if (!targetUserId) {
            return NextResponse.json(
                { message: "Target user ID is required." },
                { status: 400 }
            );
        }

        // Récupérer les données de l'utilisateur cible
        const userData = await getUserByIdServer<UserPublic>(targetUserId, UserSchemas.Public);


        if (!userData) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        // Si c'est le même utilisateur, retourner toutes les données
        if (userId === targetUserId) {
            return NextResponse.json(
                {
                    success: true,
                    user: userData,
                },
                { status: 200 }
            );
        }

        // Pour un autre utilisateur, ne renvoyer que les champs publics
        const publicUserData = {
            id: userData.id,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
            banner: userData.banner,
            biography: userData.biography,
            birthDate: userData.birthDate,
            visibility: userData.visibility,
            // Add any other public fields you need

        };

        return NextResponse.json(
            {
                success: true,
                user: publicUserData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur GET /api/private/user/[userId]:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}