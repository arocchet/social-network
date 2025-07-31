import { db } from "@/lib/db";
import { CreateReaction } from "@/lib/schemas/reaction";
import { canUserSeePost } from "../post/visibilityFilters";
import { canUserSeeStory } from "../stories/visibilityFilters";

export async function updatedReaction(
  userId: string,
  data: CreateReaction
): Promise<void> {
  console.log(data, userId, "data in updatedReaction");
  const isPost = data.contentType === "post";
  const isStory = data.contentType === "stories";
  const isComment = data.contentType === "comment";

  if (!isPost && !isStory && !isComment) {
    throw new Error(
      "Invalid target type: must be 'post', 'stories', or 'comment'"
    );
  }

  // Vérifier que le contenu existe ET que l'utilisateur peut le voir
  if (isPost) {
    const canSee = await canUserSeePost(data.mediaId, userId);
    if (!canSee) {
      throw new Error("Post not found or access denied");
    }
  } else if (isStory) {
    const canSee = await canUserSeeStory(data.mediaId, userId);
    if (!canSee) {
      throw new Error("Story not found or access denied");
    }
  } else if (isComment) {
    const exists = await db.comment.findUnique({ where: { id: data.mediaId } });
    if (!exists) {
      throw new Error("Comment not found");
    }
    // TODO: Ajouter la vérification de visibilité pour les commentaires si nécessaire
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
  console.log(
    where,
    createData,
    data.type,
    "where, createData, type in updatedReaction"
  );
  await db.reaction.upsert({
    where: where,
    update: { type: data.type },
    create: createData,
  });
}
