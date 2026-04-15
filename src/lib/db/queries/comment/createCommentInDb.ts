import { Prisma } from "@prisma/client";
import { db } from "../..";
import { Comment, CommentSchema } from "@/lib/schemas/comment";

type Params = {
    content: string;
    image?: string;
    userId: string;
    postId: string;
};

const commentSelect = {
    id: true,
    datetime: true,
    message: true,
    user: {
        select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
        },
    },
} as const;

type SelectedComment = Prisma.CommentGetPayload<{ select: typeof commentSelect }>;

export async function createCommentInDb(params: Params): Promise<Comment> {
    const created: SelectedComment = await db.comment.create({
        data: {
            postId: params.postId,
            message: params.content,
            userId: params.userId,
        },
        select: commentSelect,
    });

    return CommentSchema.parse({
        id: created.id,
        datetime: created.datetime.toISOString(),
        message: created.message,
        user: created.user,
    });
}
