import { db } from "@/lib/db";
import { getPostById } from "@/lib/db/queries/post/getPostById";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;

  try {
    const post = await getPostById(postId);

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    return Response.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
