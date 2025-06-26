import { UserPublic, UserSchemas } from "@/lib/schemas/user";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        // Récupérer les données utilisateur depuis la base de données
        const userData = await getUserByIdServer<UserPublic>(userId, UserSchemas.Public);


        if (!userData) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Valider les données avec Zod (optionnel)
        // const validatedUserData = UserInfoSchema.safeParse(userData);

        // if (!validatedUserData.success) {
        //     const errors = validatedUserData.error.flatten().fieldErrors;
        //     return NextResponse.json(
        //         { message: "Data validation failed", errors },
        //         { status: 500 }
        //     );
        // }

        // Retourner les données utilisateur (sans informations sensibles)
        // const { ...safeUserData } = validatedUserData.data;


        return NextResponse.json({
            success: true,
            data: userData
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch user info:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}