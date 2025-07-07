import { checkFriendshipInDb } from "@/lib/db/friendship/checkFriendship";
import { createFriendshipInDb } from "@/lib/db/friendship/createFriendship";
import { deleteFriendshipInDb } from "@/lib/db/friendship/deleteFriendship";
import { getUser } from "@/lib/db/user/getUser";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { ProfileVisibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: followId } = params;
    if (!followId) {
      return NextResponse.json(respondError("Follow ID is required"), {
        status: 400,
      });
    }

    const follow = await getUser({userId: followId});

      if (!follow) {
        return NextResponse.json(respondError("Follower not found"), {
          status: 404,
        });
      }

    const userId = _req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(respondError("Missing user ID"), {
        status: 401,
      });
    }

    const existingFriendship = await checkFriendshipInDb({
      followId: followId,
      userId: userId,
    });

    if (existingFriendship) {
      if (existingFriendship.status === "pending") {
        deleteFriendshipInDb({
          followId: followId, 
          userId: userId,
        })
      }

      return NextResponse.json(
        respondSuccess("Friendship canceled successfully"),
        { status: 201 }
      );
    } else {
      if (follow.id === userId) {
        return NextResponse.json(
          respondError("You cannot follow yourself"),
          { status: 400 }
        );  
      }

      const status = follow.visibility === 'PUBLIC' as ProfileVisibility ? "accepted" : "pending";

      const newFriendship = await createFriendshipInDb({
        followId: followId,
        userId: userId,
        status: status,
      });

      return NextResponse.json(
        respondSuccess(newFriendship, "Friendship created successfully"),
        { status: 201 }
      );
    }


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
