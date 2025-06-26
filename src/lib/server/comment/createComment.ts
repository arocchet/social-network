import { createCommentInDb } from "@/lib/db/queries/comment/createCommentInDb";
import { CreatePost } from "@/lib/schemas/post/create";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";

export async function createCommentServer(postId: string, comment: CreatePost, userId: string) {
    try {
        const { content, media } = comment;
        let commentMediaUrl: string | undefined;

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl } = await handleVideoPostUploads(media, userId);
                commentMediaUrl = postVideoUrl;
            } else if (isImage) {
                const { postImageUrl } = await handleImagePostUploads(media, userId);
                commentMediaUrl = postImageUrl;
            }
        }

        const commentData = {
            postId,
            content,
            userId,
            // ...(commentMediaUrl && { image: commentMediaUrl }),
        };

        return await createCommentInDb(commentData);
    } catch (error) {
        console.error("❌ Error in createPostServer:", error);
        throw new Error("Failed to create post");
    }
}
