import { db } from "../..";
import { canUserSeePost } from "./visibilityFilters";

export async function getPostById(postId: string, currentUserId?: string) {
  // Vérifier si l'utilisateur peut voir ce post
  const canSee = await canUserSeePost(postId, currentUserId);
  if (!canSee) {
    return null;
  }
  return await db.post.findUnique({
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
}
