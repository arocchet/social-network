import { createPostInDb } from "@/lib/db/queries/post/createPostInDb";
import { CreatePostForm } from "@/lib/types/types";
import { handleImagePostUploads } from "@/lib/uploads/postUploads";

export async function createPostServer(post: CreatePostForm, userId: string) {
    try {
        let postImageUrl: string | undefined = undefined;

        if (post.image) {
            const result = await handleImagePostUploads(post.image, userId);
            postImageUrl = result.postImageUrl;
        }

        const data = {
            content: post.content,
            userId,
            ...(postImageUrl && { image: postImageUrl }),
        };

        return await createPostInDb(data);
    } catch (error) {
        console.error("Error in createPost:", error);
        throw new Error("Failed to create post");
    }
}