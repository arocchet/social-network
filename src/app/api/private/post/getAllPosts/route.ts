import { getAllPosts } from "@/lib/db/queries/post/getAllPosts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
        }

        // Récupérer les données utilisateur depuis la base de données
        const allPosts = await getAllPosts();

        if (!allPosts) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }


        return NextResponse.json({
            success: true,
            data: allPosts
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch user info:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error.";

        return NextResponse.json({ message }, { status: 500 });
    }
}