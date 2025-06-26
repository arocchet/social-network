import { createStoriesIndb } from "@/lib/db/queries/stories/createStoryInDb";
import { CreateStory } from "@/lib/schemas/stories/create";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";

export async function createStoriesServer(story: CreateStory, userId: string) {
    try {
        const { media } = story;
        let storyMediaUrl: string | undefined;

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl } = await handleVideoPostUploads(media, userId);
                storyMediaUrl = postVideoUrl;
            } else if (isImage) {
                const { postImageUrl } = await handleImagePostUploads(media, userId);
                storyMediaUrl = postImageUrl;
            }
        }

        const storyData = {
            userId,
            ...(storyMediaUrl && { media: storyMediaUrl }),
        };

        return await createStoriesIndb(storyData);
    } catch (error) {
        console.error("❌ Error in createPostServer:", error);
        throw new Error("Failed to create post");
    }
}
