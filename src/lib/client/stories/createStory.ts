import { CreateStoryForm } from "@/lib/types/types";

export async function createStoryClient(story: CreateStoryForm) {
    const formData = new FormData();

    if (story.media) {
        formData.append("media", story.media);
    }

    const res = await fetch("/api/private/stories", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create story.");
    }

    return await res.json();
}