import { createPostInDb } from "@/lib/db/queries/post/createPostInDb";
import { CreatePostForm } from "@/lib/types/types";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";

export async function createPostServer(post: CreatePostForm, userId: string) {
    try {
        const { content, media } = post;
        let postMediaUrl: string | undefined;

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl } = await handleVideoPostUploads(media, userId);
                postMediaUrl = postVideoUrl;
            } else if (isImage) {
                const { postImageUrl } = await handleImagePostUploads(media, userId);
                postMediaUrl = postImageUrl;
            }
        }

        const postData = {
            content,
            userId,
            ...(postMediaUrl && { image: postMediaUrl }),
        };

        return await createPostInDb(postData);
    } catch (error) {
        console.error("❌ Error in createPostServer:", error);
        throw new Error("Failed to create post");
    }
}
