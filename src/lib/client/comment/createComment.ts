// lib/client/comment/createComment.ts
import { CreateCommentForm } from "@/lib/types/types";

export async function createCommentClient(postId: string, comment: CreateCommentForm) {
    try {
        const formData = new FormData();
        formData.append('content', comment.content);

        if (comment.media) {
            formData.append('media', comment.media);
        }
        if (!postId) {
            throw new Error("PostId non trouvé")
        }

        console.log("POSTID", postId)

        const response = await fetch(`/api/private/post/${postId}/comments`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Erreur brute de la réponse :", text);
            throw new Error('Failed to create comment');
        }

        const data = await response.json();

        console.log("Comment Data", data)
        return data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}