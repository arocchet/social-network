import { Comment } from "@/lib/schemas/comment/";
import { CreatePost } from "@/lib/schemas/post/create";
import { fetcher } from "@/lib/server/api/fetcher";

export async function createCommentClient(postId: string, comment: CreatePost) {
    try {
        const formData = new FormData();
        formData.append('content', comment.content);

        if (comment.media) {
            formData.append('media', comment.media);
        }
        if (!postId) {
            throw new Error("PostId non trouvé")
        }

        const response = await fetcher<Comment>(`/api/private/post/${postId}/comments`, {
            method: 'POST',
            body: formData
        })

        return response;
    } catch (error) {
        throw new Error(`Client error: ${(error instanceof Error) ? error.message : "Unknown error"}`);

    }
}