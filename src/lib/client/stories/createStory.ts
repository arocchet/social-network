import { CreateStory } from "@/lib/schemas/stories/";
import { fetcher } from "@/lib/server/api/fetcher";

export async function createStoryClient(story: CreateStory) {
    const formData = new FormData();

    if (story.media) {
        formData.append("media", story.media);
    }
    
    formData.append("visibility", story.visibility);
    try {
        const response = await fetcher<void>("/api/private/stories", {
            method: "POST",
            body: formData,
        });

        return response;
    } catch (error) {
        throw new Error(`Client error: ${(error instanceof Error) ? error.message : "Unknown error"}`);
    }
}