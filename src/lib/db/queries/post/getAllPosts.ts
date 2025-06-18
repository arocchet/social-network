import { db } from "../..";


export async function getAllPosts() {
  return await db.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          avatar: true,
        }
      },
      _count: {
        select: {
          reactions: true,
          comments: true
        }
      }
    },
    orderBy: {
      datetime: 'desc'
    }
  });
};