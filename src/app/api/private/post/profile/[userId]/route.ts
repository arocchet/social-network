// app/api/private/post/profile/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPostsByUserIdServer } from "@/lib/server/post/getPost";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }
    // test
    try {
        const posts = await getPostsByUserIdServer(userId);

        return NextResponse.json({ success: true, posts }, { status: 200 });
    } catch (err) {
        console.error("Erreur dans /by-user", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
