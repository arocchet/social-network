import { uploadIfFile } from "@/lib/cloudinary/uploadFile";
import { UserSchemas } from "@/lib/schemas/user";
import { UserPrivate } from "@/lib/schemas/user/private";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { updateUserServer } from "@/lib/server/user/updateServerUser";
import { ValidationError } from "@/lib/validations/validationError";
// import { UserInfoSchema } from "@/lib/validations/userValidation";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        // Récupérer les données utilisateur depuis la base de données
        const userData = await getUserByIdServer<UserPrivate>(userId, UserSchemas.Private);


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
export async function PUT(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
    }

    const formData = await req.formData();
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
            data[key] = value;
        }
    }

    try {
        const coverUpload = await uploadIfFile(formData.get("cover"), `users/${userId}`);
        if (coverUpload) {
            data.cover = coverUpload.url;
            data.coverId = coverUpload.id;
        }

        const bannerUpload = await uploadIfFile(formData.get("banner"), `users/${userId}`);
        if (bannerUpload) {
            data.banner = bannerUpload.url;
            data.bannerId = bannerUpload.id;
        }

        await updateUserServer(userId, data);

        return NextResponse.json({ status: 200 });

    } catch (err) {
        if (err instanceof ValidationError) {
            return NextResponse.json(
                {
                    message: "Validation error",
                    fieldErrors: err.fieldErrors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: err instanceof Error ? err.message : "Unexpected error",
            },
            { status: 500 }
        );
    }
}