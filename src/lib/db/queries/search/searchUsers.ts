import { db } from "../..";

export async function searchUsers(query: string, limit = 5) {
    if (!query) return [];

    return await db.user.findMany({
        where: {
            OR: [
                { username: { contains: query, mode: "insensitive" } },
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
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
