import { db } from "../..";

export async function searchUsers(query: string, limit = 5) {
    if (!query) return [];

    return await db.user.findMany({
        where: {
            OR: [
                { username: { contains: query } },
                { firstName: { contains: query } },
                { lastName: { contains: query } },
            ],
        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
        },
        take: limit,
    });
}
