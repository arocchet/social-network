import { getUserByIdServer } from "@/lib/server/user/getUser";
import { updateUserServer } from "@/lib/server/user/updateClientUser";
// import { UserInfoSchema } from "@/lib/validations/userValidation";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        // Récupérer les données utilisateur depuis la base de données
        const userData = await getUserByIdServer(userId);



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
            user: userData
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch user info:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
    }

    const data = await req.json();

    try {
        await updateUserServer(userId, data);
        return NextResponse.json({ status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            const isZodError = err.message === "Invalid payload";
            return NextResponse.json(
                { message: isZodError ? "Invalid Data." : err.message },
                { status: isZodError ? 400 : 500 }
            );
        }

        return NextResponse.json(
            { message: "Unexpected server error." },
            { status: 500 }
        );
    }
}