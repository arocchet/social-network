import { db } from "@/lib/db";
import { CreateReaction } from "@/lib/schemas/reaction";

export async function updatedReaction(
  userId: string,
  data: CreateReaction
): Promise<void> {
  const isPost = data.contentType === "post";
  const isStory = data.contentType === "stories";
  const isComment = data.contentType === "comment";

  if (!isPost && !isStory && !isComment) {
    throw new Error(
      "Invalid target type: must be 'post', 'stories', or 'comment'"
    );
  }

  let exists = null;

  if (isPost) {
    exists = await db.post.findUnique({ where: { id: data.mediaId } });
  } else if (isStory) {
    exists = await db.story.findUnique({ where: { id: data.mediaId } });
  } else if (isComment) {
    exists = await db.comment.findUnique({ where: { id: data.mediaId } });
  }

  if (!exists) {
    const entityType = isPost ? "Post" : isStory ? "Story" : "Comment";
    throw new Error(`${entityType} with ID ${data.mediaId} not found`);
  }

  const where = isPost
    ? { userId_postId: { userId, postId: data.mediaId } }
    : isStory
      ? { userId_storyId: { userId, storyId: data.mediaId } }
      : { userId_commentId: { userId, commentId: data.mediaId } };

  const createData = {
    userId,
    type: data.type,
    ...(isPost && { postId: data.mediaId }),
    ...(isStory && { storyId: data.mediaId }),
    ...(isComment && { commentId: data.mediaId }),
  };

  await db.reaction.upsert({
    where: where,
    update: { type: data.type },
    create: createData,
  });
}
