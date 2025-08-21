// app/api/private/post/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPostsByUserIdServer } from "@/lib/server/post/getPost";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const currentUserId = req.headers.get("x-user-id");

    if (!userId) {
        return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }
    
    try {
        const posts = await getPostsByUserIdServer(userId, currentUserId || undefined);

        return NextResponse.json({ success: true, posts }, { status: 200 });
    } catch (err) {
        console.error("Erreur dans /by-user", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
