import { NextRequest, NextResponse } from "next/server";
import { createGroupInDb } from "@/lib/db/queries/groups/createGroup";
import { respondError, respondSuccess } from "@/lib/server/api/response";

export async function POST(req: NextRequest) {
  try {
    const ownerId = req.headers.get("x-user-id");
    const body = await req.json();
    const { userIds, title } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length < 1) {
      return NextResponse.json(
        respondError("A group must have at least two members."),
        { status: 400 }
      );
    }

    if (!ownerId) {
      return NextResponse.json(respondError("Authentication required."), {
        status: 401,
      });
    }

    const data = {
      userIds,
      title,
      ownerId,
    };

    const newGroup = await createGroupInDb(data);

    return NextResponse.json(
      respondSuccess(newGroup, "Group created successfully."),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while creating group:", error);

    return NextResponse.json(
      respondError("An error occurred while creating the group."),
      { status: 500 }
    );
  }
}
