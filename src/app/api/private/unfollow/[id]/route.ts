import { checkFriendshipInDb } from "@/lib/db/friendship/checkFriendship";
import { deleteFriendshipInDb } from "@/lib/db/friendship/deleteFriendship";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { UserPublic, UserSchemas } from "@/lib/schemas/user";

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: followId } = await params;
        if (!followId) {
            return NextResponse.json(respondError("Follow ID is required"), {
                status: 400,
            });
        }

        const follow = await getUserByIdServer<UserPublic>(followId, UserSchemas.Public);

        // Check if the user exists
        if (!follow) {
            return NextResponse.json(respondError("Follower not found"), {
                status: 404,
            });
        }

        const userId = await getUserIdFromRequest(_req);
        // Validate userId from request headers
        if (!userId) {
            return NextResponse.json(respondError("Not authenticated"), {
                status: 401,
            });
        }

        // Check if the friendship exists
        const existingFriendship = await checkFriendshipInDb({
            followId: followId,
            userId: userId,
        });

        if (!existingFriendship) {
            return NextResponse.json(
                respondError("Friendship does not exist"),
                { status: 404 }
            );
        }

        // If the friendship exists, delete it
        await deleteFriendshipInDb({
            followId: followId,
            userId: userId,
        })


        return NextResponse.json(
            respondSuccess(null, "Friendship deleted successfully"),
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
