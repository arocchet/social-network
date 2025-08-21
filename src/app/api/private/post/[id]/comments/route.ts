import { NextRequest, NextResponse } from "next/server";
import { createCommentServer } from "@/lib/server/comment/createComment";
import { parseCreateComment } from "@/lib/parsers/formParsers";
import { PostSchemas } from "@/lib/schemas/post";
import { parseOrThrow, ValidationError } from "@/lib/utils/validation";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get("x-user-id");
        const { id: postId } = await params;

        if (!userId) {
            return NextResponse.json(respondError("Missing or invalid user ID"), { status: 401 });
        }

        if (!postId) {
            return NextResponse.json(respondError("Post ID is required"), { status: 400 });
        }

        const formData = await req.formData();
        const rawComment = parseCreateComment(formData);

        const comment = parseOrThrow(PostSchemas.create, rawComment);

        // Ensure visibility is always defined
        const commentWithVisibility = {
            ...comment,
            visibility: comment.visibility ?? "PUBLIC" as const,
        };

        const createdComment = await createCommentServer(postId, commentWithVisibility, userId);

        return NextResponse.json(respondSuccess(createdComment, "Comment created"), { status: 201 });
    } catch (error) {
        console.error("❌ Failed to create comment:", error);

        if (error instanceof ValidationError) {
            return NextResponse.json(
                respondError("Validation failed", error.fieldErrors),
                { status: 400 }
            );
        }

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json(respondError(message), { status: 500 });
    }
}
