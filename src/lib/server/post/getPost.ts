import { db } from "@/lib/db";
import { PostWithDetails } from "@/lib/schemas/post";
import { serializeDates } from "@/lib/utils/serializeDates";

export async function getPostsByUserIdServer(
  userId: string
): Promise<PostWithDetails[]> {
  try {
    const posts = await db.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reactions: true,
              },
            },
          },
          orderBy: {
            datetime: "desc",
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
      orderBy: {
        datetime: "desc",
      },
    });

    return serializeDates(posts);
  } catch (error) {
    console.error("Database error in getPostsByUserIdServer:", error);
    throw new Error("Failed to fetch user posts");
  }
}
