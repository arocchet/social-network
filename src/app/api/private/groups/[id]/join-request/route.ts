import { sendRequestToJoinGroup } from "@/lib/db/queries/groups/createRequestToJoinGroup";
import { respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const seeker = req.headers.get("x-user-id");

    if (!groupId || !seeker) {
      return NextResponse.json(respondError("Missing groupId or seeker"), {
        status: 404,
      });
    }

    const data = {
      groupId,
      seeker,
    };

    const requestCreated = await sendRequestToJoinGroup(data);

    return NextResponse.json(requestCreated, { status: 201 });
  } catch (err) {
    console.error(
      "POST: api/public/groups/[id]/join-request/ Failed to create request: ",
      err
    );
    return NextResponse.json(
      respondError(err instanceof Error ? err.message : "Unexpected error"),
      { status: 500 }
    );
  }
}
