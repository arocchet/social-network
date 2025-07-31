import { createPostInDb } from "@/lib/db/queries/post/createPostInDb";
import { PostSchemas } from "@/lib/schemas/post";
import { CreatePost } from "@/lib/schemas/post/create";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";
import { parseOrThrow } from "../../utils/";
import { serializeDates } from "@/lib/utils/serializeDates";
import { PostWithCountsSchema } from "@/lib/schemas/post/count";

export async function createPostServer(post: CreatePost, userId: string) {
    try {
        const { content, media } = post;
        let postMediaUrl: string | undefined;
        let postMediaId: string | undefined

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl, postVideoId } = await handleVideoPostUploads(media, userId);
                postMediaUrl = postVideoUrl;
                postMediaId = postVideoId ?? undefined
            } else if (isImage) {
                const { postImageUrl, postImageId } = await handleImagePostUploads(media, userId);
                postMediaUrl = postImageUrl;
                postMediaId = postImageId ?? undefined
            }
        }

        const postData = {
            content,
            userId,
            ...(postMediaUrl && { image: postMediaUrl }),
            ...(postMediaId && { mediaId: postMediaId })
        };

        const newPost = await createPostInDb(postData)

        return parseOrThrow(PostWithCountsSchema, serializeDates(newPost));
    } catch (error) {
        console.error("❌ Error in createPostServer:", error);
        throw new Error("Failed to create post");
    }
}
