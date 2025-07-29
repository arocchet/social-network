import { db } from "../..";

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

export async function getPaginatedPosts(skip: number, take: number = 10) {
  return await db.post.findMany({
    skip,
    take,
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
