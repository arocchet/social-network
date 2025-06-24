// app/api/private/post/[id]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseCreateComment } from "@/lib/validations/parseFormData/commentValidation";
import { CommentSchema } from "@/lib/validations/createCommentSchemaZod";
import { createCommentServer } from "@/lib/server/comment/createComment";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = req.headers.get("x-user-id");

        // Attendre la résolution des paramètres
        const resolvedParams = await params;
        const { id: postId } = resolvedParams;

        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        if (!postId) {
            return NextResponse.json({ message: "Post ID is required." }, { status: 400 });
        }

        const formData = await req.formData();
        const comment = parseCreateComment(formData);

        const parsed = CommentSchema.safeParse(comment);

        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { message: "Validation failed", errors },
                { status: 400 }
            );
        }

        const createdComment = await createCommentServer(postId, comment, userId);

        return NextResponse.json({
            success: true,
            comment: createdComment
        }, { status: 201 });
    } catch (error) {
        console.error("Comment creation failed:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}
