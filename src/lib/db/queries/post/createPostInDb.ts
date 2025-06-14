import { db } from "../..";

type Params = {
    content: string;
    image?: string;
    userId: string;
};

export async function createPostInDb(post: Params) {
    return await db.post.create({
        data: {
            message: post.content,
            ...(post.image ? { image: post.image } : {}),
            visibility: "PRIVATE",
            userId: post.userId,
        }
    });
}