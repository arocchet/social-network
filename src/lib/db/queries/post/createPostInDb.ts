import { db } from "../..";

type Params = {
    content: string;
    image?: string;
    userId: string;
    mediaId?: string
};

export async function createPostInDb(post: Params) {
    return await db.post.create({
        data: {
            message: post.content,
            ...(post.image ? { image: post.image } : {}),
            ...(post.mediaId ? { mediaId: post.mediaId } : {}),
            visibility: "PRIVATE",
            userId: post.userId,
        },
        select: {
            id: true,
            message: true,
            datetime: true,
            image: true,
            visibility: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    username: true
                }
            },
            _count: {
                select: {
                    comments: true,
                    reactions: true
                }
            }
        }
    });
}