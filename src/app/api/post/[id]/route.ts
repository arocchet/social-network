import {PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            datetime: 'desc'
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    return Response.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
