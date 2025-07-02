
import { createStoriesInDb } from "@/lib/db/queries/stories/createStoryInDb";
import { CreateStory } from "@/lib/schemas/stories/create";
import { handleImagePostUploads, handleVideoPostUploads } from "@/lib/uploads/postUploads";

export async function createStoriesServer(story: CreateStory, userId: string) {
    try {
        const { media } = story;

        let storyMediaUrl: string | undefined;
        let storyMediaId: string | undefined;

        if (media) {
            const isVideo = media.type.startsWith("video");
            const isImage = media.type.startsWith("image");

            if (isVideo) {
                const { postVideoUrl, postVideoId } = await handleVideoPostUploads(media, userId);
                storyMediaUrl = postVideoUrl;
                storyMediaId = postVideoId ?? undefined;
            } else if (isImage) {
                const { postImageUrl, postImageId } = await handleImagePostUploads(media, userId);
                storyMediaUrl = postImageUrl;
                storyMediaId = postImageId ?? undefined;
            }
        }

        const storyData = {
            userId,
            media: storyMediaUrl,
            mediaId: storyMediaId,
        };

        return await createStoriesInDb(storyData);
    } catch (error) {
        console.error("❌ Error in createStoriesServer:", error);
        throw new Error("Failed to create story");
    }
}
