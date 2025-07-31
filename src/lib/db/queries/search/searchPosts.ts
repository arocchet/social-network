import { db } from "../..";
import { buildPostVisibilityFilter } from "../post/visibilityFilters";

export async function searchPosts(query: string, currentUserId?: string, limit = 10) {
    if (!query) return [];

    // Construire le filtre de visibilité
    const visibilityFilter = buildPostVisibilityFilter({
        currentUserId,
        showPrivatePosts: false, // Dans la recherche, on ne montre pas les posts privés personnels
    });

    return await db.post.findMany({
        where: {
            AND: [
                { message: { contains: query, mode: "insensitive" } },
                visibilityFilter,
            ],
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