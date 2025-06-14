import { CreatePostForm } from "@/lib/types/types";

export async function createPostClient(post: CreatePostForm) {
    const formData = new FormData();
    formData.append("content", post.content);

    if (post.image) {
        formData.append("img", post.image);
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