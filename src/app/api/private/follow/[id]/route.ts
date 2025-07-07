import { createFriendshipInDb } from "@/lib/db/friendship/createFriendship";
import { respondSuccess, respondError } from "@/lib/server/api/response";
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

    const userId = _req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(respondError("Missing user ID"), {
        status: 401,
      });
    }

    const newFriendship = await createFriendshipInDb({
      followId,
      userId,
      status: "accepted",
    });

    return NextResponse.json(
      respondSuccess(newFriendship, "Friendship created successfully"),
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
