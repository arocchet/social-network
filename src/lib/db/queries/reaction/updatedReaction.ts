import { db } from "@/lib/db";
import { CreateReaction } from "@/lib/schemas/reaction";

export async function updatedReaction(
  userId: string,
  data: CreateReaction,
): Promise<void> {
  const isPost = data.contentType === "post";
  const isStory = data.contentType === "stories";

  if (!isPost && !isStory) {
    throw new Error("Invalid target type: must be 'post' or 'stories'");
  }

  const exists = isPost
    ? await db.post.findUnique({ where: { id: data.mediaId } })
    : await db.story.findUnique({ where: { id: data.mediaId } });

  if (!exists) {
    throw new Error(`Target ${data.type} with ID ${data.mediaId} not found`);
  }

  const where = isPost
    ? { userId_postId: { userId, postId: data.mediaId } }
    : { userId_storyId: { userId, storyId: data.mediaId } };

  const createData = {
    userId,
    type: data.type,
    ...(isPost ? { postId: data.mediaId } : { storyId: data.mediaId }),
  };

  await db.reaction.upsert({
    where,
    update: { type: data.type },
    create: createData,
  });
}
