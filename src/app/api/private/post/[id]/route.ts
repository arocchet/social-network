import { getPostById } from "@/lib/db/queries/post/getPostById";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const currentUserId = req.headers.get("x-user-id") || undefined;

    if (!postId) {
      return NextResponse.json(respondError("Post ID is required"), {
        status: 400,
      });
    }

    const post = await getPostById(postId, currentUserId);

    if (!post) {
      return NextResponse.json(respondError("Post not found"), { status: 404 });
    }

    return NextResponse.json(respondSuccess(post));
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json(
      respondError(
        err instanceof Error ? err.message : "Unexpected server error"
      ),
      { status: 500 }
    );
  }
}
