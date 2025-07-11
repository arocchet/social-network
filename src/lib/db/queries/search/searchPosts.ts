import { db } from "../..";

export async function searchPosts(query: string, limit = 10) {
    if (!query) return [];

    return await db.post.findMany({
        where: {
            message: { contains: query, mode: "insensitive" },
        },
        select: {
            id: true,
            message: true,
            datetime: true,
            image: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                },
            },
            _count: {
                select: {
                    reactions: true,
                    comments: true,
                },
            },
        },
        orderBy: {
            datetime: "desc",
        },
        take: limit,
    });
}