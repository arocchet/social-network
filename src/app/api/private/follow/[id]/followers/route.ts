import { NextRequest, NextResponse } from "next/server";
import { InvitationStatus } from "@prisma/client";
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

        const followers = await db.friendship.findMany({
            where: { friendId: userId, status: InvitationStatus.ACCEPTED },
            include: { user: true },
        });

        return NextResponse.json(
            respondSuccess(
                followers.map((f) => f.user),
                "Followers retrieved successfully"
            ),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error retrieving followers:", err);
        return NextResponse.json(
            respondError(err instanceof Error ? err.message : "Unexpected server error"),
            { status: 500 }
        );
    }
}
