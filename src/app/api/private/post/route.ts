import { NextRequest, NextResponse } from "next/server";
import { createPostServer } from "@/lib/server/post/createPost";
import { getPostsByUserIdServer } from "@/lib/server/post/getPost";
import { PostSchemas } from "@/lib/schemas/post";
import { parseCreatePost } from "@/lib/parsers/formParsers";
import { parseOrThrow } from "@/lib/utils/validation";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json(respondError("Missing user ID"), { status: 401 });
        }

        const formData = await req.formData();
        const rawPost = parseCreatePost(formData);
        const parsedData = parseOrThrow(PostSchemas.create, rawPost);

        const createdPost = await createPostServer(parsedData, userId);

        return NextResponse.json(respondSuccess(createdPost), { status: 201 });
    } catch (err) {
        console.error("POST /api/private/post — Creation failed:", err);

        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected error"),
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return NextResponse.json(respondError("Missing user ID"), { status: 401 });
        }

        const posts = await getPostsByUserIdServer(userId);

        return NextResponse.json(
            respondSuccess(posts, posts.length === 0 ? "No posts available yet." : undefined),
            { status: 200 }
        );
    } catch (err) {
        console.error("GET /api/private/post — Retrieval failed:", err);

        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected error"),
            { status: 500 }
        );
    }
}