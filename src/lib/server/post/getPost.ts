import { db } from "@/lib/db";
import { Post, Reaction, User } from "@prisma/client";

export type PostWithDetails = Post & {
    user: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'avatar'>;
    comments: (Comment & {
        user: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'avatar'>;
    })[];
    reactions: (Reaction & {
        user: Pick<User, 'id' | 'username'>;
    })[];
    _count: {
        comments: number;
        reactions: number;
    };
};


export async function getPostsByUserIdServer(userId: string): Promise<PostWithDetails[]> {
    try {
        const posts = await db.post.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            }
                        }
                    },
                    orderBy: {
                        datetime: 'desc'
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    }
                }
            },
            orderBy: {
                datetime: 'desc'
            }
        });

        return posts;
    } catch (error) {
        console.error("Database error in getPostsByUserIdServer:", error);
        throw new Error("Failed to fetch user posts");
    }
}