import { getPaginatedPosts } from "@/lib/db/queries/post/getAllPosts";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(respondError("Missing or invalid user ID"), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);

    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "10", 10);

    if (isNaN(skip) || skip < 0 || isNaN(take) || take <= 0 || take > 50) {
      return NextResponse.json(respondError("Invalid pagination parameters."), {
        status: 400,
      });
    }

    console.log('🔍 Debug: userId =', userId, 'skip =', skip, 'take =', take);
    
    const posts = await getPaginatedPosts(skip, take, userId);
    
    console.log('📊 Debug: Found', posts.length, 'posts');
    console.log('📋 Debug: Posts preview:', posts.slice(0, 2).map(p => ({
      id: p.id,
      message: p.message.substring(0, 50) + '...',
      visibility: p.visibility,
      userId: p.userId
    })));

    return NextResponse.json(
      respondSuccess(
        posts,
        posts.length === 0 ? "No posts available yet." : undefined
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);

    return NextResponse.json(
      respondError(
        error instanceof Error ? error.message : "Unexpected server error."
      ),
      { status: 500 }
    );
  }
}
