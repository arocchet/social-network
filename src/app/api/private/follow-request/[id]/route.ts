import { getFriendshipById } from "@/lib/db/friendship/getFriendshipById";
import { updateFriendship } from "@/lib/db/friendship/updateFriendship";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: any   // <-- corrige le conflit de types ici
) {
  try {
    const followRequestId = params.id;

    if (!followRequestId) {
      return NextResponse.json(respondError("Follow ID is required"), {
        status: 400,
      });
    }

    const followRequest = await getFriendshipById({ friendshipId: followRequestId });

    if (!followRequest) {
      return NextResponse.json(respondError("Follow request not found"), {
        status: 404,
      });
    }

    if (followRequest.status !== "pending") {
      return NextResponse.json(respondError("Follow request is not pending"), {
        status: 400,
      });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (!status || (status !== "accepted" && status !== "rejected")) {
      return NextResponse.json(
        respondError("Status must be 'accepted' or 'rejected'"),
        { status: 400 }
      );
    }

    await updateFriendship({
      friendshipId: followRequestId,
      status,
    });

    return NextResponse.json(
      respondSuccess(null, "Friendship updated successfully"),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error updating friendship:", err);
    return NextResponse.json(
      respondError(
        err instanceof Error ? err.message : "Unexpected server error"
      ),
      { status: 500 }
    );
  }
}
