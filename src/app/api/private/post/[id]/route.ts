// import { getPostById } from "@/lib/db/queries/post/getPostById";
// import { NextRequest } from "next/server";


// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const postId = params.id;

//   try {
//     const post = await getPostById(postId);

//     if (!post) {
//       return new Response("Post not found", { status: 404 });
//     }

//     return Response.json(post);
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }


// app/api/private/post/[postId]/route.ts
// app/api/private/post/[postId]/route.ts
// app/api/private/post/[id]/route.ts
import { getPostById } from '@/lib/db/queries/post/getPostById';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Attendre la résolution des paramètres
    const resolvedParams = await params;
    const { id: postId } = resolvedParams;

    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}