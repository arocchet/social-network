import { db } from "../..";

export async function deleteReaction(id: string) {
    return await db.reaction.deleteMany({
        where: {
            OR: [
                { storyId: id },
                { postId: id },
                { commentId: id },
            ],
        },
    });
}
