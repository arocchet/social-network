import { db } from "../..";
import { Visibility } from "@prisma/client";

type Params = {
  userId: string;
  media?: string;
  mediaId?: string;
  visibility: Visibility;
};

export async function createStoriesInDb(params: Params) {
  return await db.story.create({
    data: {
      userId: params.userId,
      visibility: params.visibility || Visibility.PUBLIC,
      ...(params.media && { media: params.media }),
      ...(params.mediaId && { mediaId: params.mediaId }),
    },
    select: {
      id: true,
      datetime: true,
      media: true,
      visibility: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          username: true
        }
      },
      _count: {
        select: {
          reactions: true
        }
      },
      reactions: {
        select: {
          id: true,
          type: true,
          user: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      }
    }
  });
}
