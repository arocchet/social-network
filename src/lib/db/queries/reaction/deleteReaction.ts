import { db } from "../..";

export async function deleteReaction(contentId: string, userId: string) {
    return await db.reaction.deleteMany({
        where: {
            userId: userId, // Only delete reactions from this user
            OR: [
                { storyId: contentId },
                { postId: contentId },
                { commentId: contentId },
            ],
        },
    });
}
