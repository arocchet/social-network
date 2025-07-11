import { NextRequest, NextResponse } from "next/server";
import { getVideoReels } from "@/lib/db/queries/post/getVideoReels";
import { respondSuccess, respondError } from "@/lib/server/api/response";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "10", 10);

    try {
        const posts = await getVideoReels(skip, take);
        return NextResponse.json(
            respondSuccess(posts, posts.length === 0 ? "No video reels available yet." : undefined),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching video reels:", error);
        return NextResponse.json(
            respondError(
                error instanceof Error ? error.message : "Failed to fetch video reels"
            ),
            { status: 500 }
        );
    }
}