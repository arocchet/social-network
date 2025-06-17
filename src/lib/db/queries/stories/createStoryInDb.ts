import { db } from "../..";

type Params = {
    media?: string;
    userId: string;
};

export async function createStoriesIndb(story: Params) {
    return await db.story.create({
        data: {
            ...(story.media ? { media: story.media } : {}),
            visibility: "PUBLIC",
            userId: story.userId,
        }
    });
}