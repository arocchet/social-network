import { db } from "../..";

type Params = {
  userId: string;
  media?: string;
  mediaId?: string;
};

export async function createStoriesInDb(params: Params) {
  return await db.story.create({
    data: {
      userId: params.userId,
      visibility: "PUBLIC",
      ...(params.media && { media: params.media }),
      ...(params.mediaId && { mediaId: params.mediaId }),
    },
  });
}
