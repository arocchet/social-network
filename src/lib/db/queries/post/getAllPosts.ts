import { db } from "../..";
import { buildPostVisibilityFilter } from "./visibilityFilters";

// export async function getAllPosts() {
//   return await db.post.findMany({
//     include: {
//       user: {
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           username: true,
//           avatar: true,
//         }
//       },
//       _count: {
//         select: {
//           reactions: true,
//           comments: true
//         }
//       }
//     },
//     orderBy: {
//       datetime: 'desc'
//     }
//   });
// };

export async function getPaginatedPosts(
  skip: number,
  take: number = 10,
  currentUserId?: string
) {
  const visibilityFilter = buildPostVisibilityFilter({
    currentUserId,
    showPrivatePosts: false,
  });

  console.log('🔍 visibilityFilter:', JSON.stringify(visibilityFilter, null, 2));

  return await db.post.findMany({
    skip,
    take,
    where: visibilityFilter,
    orderBy: { datetime: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          lastName: true,
          firstName: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

export async function getUserPosts(
  userId: string,
  skip: number,
  take: number = 10,
  currentUserId?: string
) {
  // D'abord récupérer la visibilité du compte cible
  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { visibility: true },
  });

  const visibilityFilter = buildPostVisibilityFilter({
    currentUserId,
    targetUserId: userId,
    targetUserAccountVisibility: targetUser?.visibility || "PUBLIC",
  });

  return await db.post.findMany({
    skip,
    take,
    where: {
      userId,
      ...visibilityFilter,
    },
    orderBy: { datetime: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          lastName: true,
          firstName: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}
