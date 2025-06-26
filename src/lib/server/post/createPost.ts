import { createPostInDb } from "@/lib/db/queries/post/createPostInDb";
import { CreatePost } from "@/lib/schemas/post/create";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";

export async function createPostServer(post: CreatePost, userId: string) {
    try {
        const { content, media } = post;
        let postMediaUrl: string | undefined;
        let postMediaId: string | null

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl, postVideoId } = await handleVideoPostUploads(media, userId);
                postMediaUrl = postVideoUrl;
                postMediaId = postVideoId
            } else if (isImage) {
                const { postImageUrl, postImageId } = await handleImagePostUploads(media, userId);
                postMediaUrl = postImageUrl;
                postMediaId = postImageId
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
