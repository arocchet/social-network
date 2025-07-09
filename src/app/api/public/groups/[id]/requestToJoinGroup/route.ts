import { sendRequestToJoinGroup } from "@/lib/db/queries/groups/createRequestToJoinGroup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const body = await request.json();
    const seeker = body?.seeker;

    const requestCreated = await sendRequestToJoinGroup(groupId, seeker);

    return NextResponse.json(requestCreated, { status: 201 });
  } catch (error: any) {
    console.error("Error creating group join request:", error);

    let status = 500;
    let message = "Internal server error";

    if (error.message === "Missing groupId or seeker") status = 400;
    else if (error.message === "Group not found") status = 404;
    else if (error.message === "Request already exists") status = 409;

    return NextResponse.json({ error: message }, { status });
  }
}
