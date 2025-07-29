import { db } from "../..";

export async function getVideoReels(skip: number, take: number = 10) {
    return await db.post.findMany({
        where: {
            image: {
                not: null,
            },
            OR: [
                // Check for video file extensions
                { image: { contains: ".mp4" } },
                { image: { contains: ".mov" } },
                { image: { contains: ".avi" } },
                { image: { contains: ".webm" } },
                { image: { contains: ".mkv" } },
                { image: { contains: ".flv" } },
                // Check for video MIME types or paths
                { image: { contains: "/video/" } },
                { image: { contains: "video" } },
            ],
        },
        skip,
        take,
        orderBy: {
            datetime: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    lastName: true,
                    firstName: true,
                },
            },
            _count: {
                select: {
                    reactions: true,
                    comments: true,
                },
            },
        },
    });
}