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

        const postResults = posts.map((post) => ({
            id: post.id,
            type: "posts",
            content: post.message,
            createdAt: post.datetime,
            images: post.image,
            user: {
                id: post.user.id,
                username: post.user.username ?? "",
                displayName: `${post.user.firstName ?? ""} ${post.user.lastName ?? ""}`.trim(),
                image: post.user.avatar ?? "",
            },
            stats: {
                likes: post._count.reactions,
                comments: post._count.comments,
            },
        }));

        const results = [...userResults, ...postResults];

        return NextResponse.json(results);
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
