import { db } from "../..";

type Params = {
    content: string;
    image?: string;
    userId: string;
    postId: string;
};

export async function createCommentInDb(comment: Params) {
    return await db.comment.create({
        data: {
            postId: comment.postId,
            message: comment.content,
            // ...(comment.image ? { image: comment.image } : {}),
            userId: comment.userId,
        }
    });
}