import { CreatePost } from "@/lib/schemas/post/create";

export async function createPostClient(post: CreatePost) {
    const formData = new FormData();
    formData.append("content", post.content);

    if (post.media) {
        formData.append("media", post.media);
    }

    const res = await fetch("/api/private/post", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create post.");
    }

    return await res.json();
}