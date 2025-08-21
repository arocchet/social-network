import { searchUsers } from "@/lib/db/queries/search/searchUsers";
import { searchPosts } from "@/lib/db/queries/search/searchPosts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    
    // Récupérer l'ID de l'utilisateur connecté depuis les headers
    const currentUserId = req.headers.get("x-user-id") || undefined;

    try {
        const [users, posts] = await Promise.all([
            searchUsers(query),
            searchPosts(query, currentUserId),
        ]);

        const userResults = users.map((user) => ({
            id: user.id,
            type: "accounts",
            username: user.username ?? "",
            displayName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            image: user.avatar ?? "",
        }));

        const postResults = posts.map((post) => {
            // Type assertion to handle include vs select TypeScript issue
            const postWithUser = post as typeof post & {
                user: {
                    id: string;
                    username: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    avatar: string | null;
                };
                _count: {
                    reactions: number;
                    comments: number;
                };
            };

            return {
                id: postWithUser.id,
                type: "posts" as const,
                content: postWithUser.message,
                createdAt: postWithUser.datetime,
                images: postWithUser.image,
                user: {
                    id: postWithUser.user.id,
                    username: postWithUser.user.username ?? "",
                    displayName: `${postWithUser.user.firstName ?? ""} ${postWithUser.user.lastName ?? ""}`.trim(),
                    image: postWithUser.user.avatar ?? "",
                },
                stats: {
                    likes: postWithUser._count.reactions,
                    comments: postWithUser._count.comments,
                },
            };
        });

        const results = [...userResults, ...postResults];

        return NextResponse.json(results);
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
