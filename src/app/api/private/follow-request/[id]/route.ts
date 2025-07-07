import { getFriendshipById } from "@/lib/db/friendship/getFriendshipById";
import { updateFriendship } from "@/lib/db/friendship/updateFriendship";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: followRequestId } = params;
        if (!followRequestId) {
            return NextResponse.json(respondError("Follow ID is required"), {
                status: 400,
            });
        }

        const followRequest = await getFriendshipById({ friendshipId: followRequestId });

        // Check if the friendship exists
        if (!followRequest) {
            return NextResponse.json(respondError("Follow request not found"), {
                status: 404,
            });
        }

        // Check if the follow request is pending
        if (followRequest.status !== "pending") {
            return NextResponse.json(
                respondError("Follow request is not pending"),
                { status: 400 }
            );
        }

        // Get status from query parameters
        // Example: POST /api/private/follow-request/123?status=accepted
        const { searchParams } = new URL(_req.url)
        const status = searchParams.get("status")

        // Validate status
        // It should be either "accepted" or "rejected"
        if (!status || (status !== "accepted" && status !== "rejected")) {
            return NextResponse.json(
                respondError("Status must be 'accepted' or 'rejected'"),
                { status: 400 }
            );
        }

        // Update the friendship status based on the provided status
        await updateFriendship({
            friendshipId: followRequestId,
            status: status,
        }); 

        return NextResponse.json(
            respondSuccess(null, "Friendship accepted successfully"),
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating friendship:", err);
        return NextResponse.json(
            respondError(
                err instanceof Error ? err.message : "Unexpected server error"
            ),
            { status: 500 }
        );
    }
}