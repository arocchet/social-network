import { NextRequest, NextResponse } from "next/server";
import { parseCreatePost } from "@/lib/validations/parseFormData/postValidation";
import { createPostServer } from "@/lib/server/post/createPost";
import { PostSchema } from "@/lib/validations/createPostSchemaZod";
import { getPostsByUserIdServer } from "@/lib/server/post/getPost";

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        const formData = await req.formData();
        const post = parseCreatePost(formData);

        const parsed = PostSchema.safeParse(post);

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 }
            );
        }

        await createPostServer(post, userId);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Post creation failed:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        // Récupérer les données utilisateur depuis la base de données
        const postData = await getPostsByUserIdServer(userId);

        if (!postData) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }


        return NextResponse.json({
            success: true,
            user: postData
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch user info:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}

