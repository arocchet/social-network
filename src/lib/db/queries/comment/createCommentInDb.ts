import { serializeDates } from "@/lib/utils/serializeDates";
import { db } from "../..";
import { Comment } from "@/lib/schemas/comment";

type Params = {
    content: string;
    image?: string;
    userId: string;
    postId: string;
};

export async function createCommentInDb(comment: Params): Promise<Comment> {
    const newComment = await db.comment.create({
        data: {
            postId: comment.postId,
            message: comment.content,
            // ...(comment.image ? { image: comment.image } : {}),
            userId: comment.userId,
        },
        select: {
            id: true,
            datetime: true,
            message: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                }
            }
        }
    });

    return serializeDates(newComment)
}