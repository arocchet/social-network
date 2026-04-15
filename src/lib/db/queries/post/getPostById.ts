import { db } from "../..";
import { canUserSeePost } from "./visibilityFilters";

export async function getPostById(postId: string, currentUserId?: string) {
  // Vérifier si l'utilisateur peut voir ce post
  const canSee = await canUserSeePost(postId, currentUserId);
  if (!canSee) {
    return null;
  }

  const post = await db.post.findUnique({
    where: { id: postId },
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
          Reaction: {
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
              Reaction: true,
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
  });

  if (!post) return null;

  // Adapter la structure pour coller aux schémas Zod côté client
  const mapped = {
    ...post,
    comments: post.comments.map((c: any) => ({
      id: c.id,
      datetime: c.datetime,
      message: c.message,
      user: c.user,
      reactions: c.reaction ?? [],
      _count: c._count ? { reactions: c._count.Reaction ?? 0 } : undefined,
    })),
  } as any;

  return mapped;
}
