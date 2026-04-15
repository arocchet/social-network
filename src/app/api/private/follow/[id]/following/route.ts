import { NextRequest, NextResponse } from "next/server";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { db } from "@/lib/db";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        if (!userId) {
            return NextResponse.json(respondError("User ID is required"), { status: 400 });
        }

        const following = await db.friendship.findMany({
            where: { userId: userId, status: "ACCEPTED" },
            include: { friend: true } // info sur l'utilisateur suivi
        });

        return NextResponse.json(
            respondSuccess(
                following,
                "Following retrieved successfully"
            ),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error retrieving following:", err);
        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected server error"),
            { status: 500 }
        );
    }
}
