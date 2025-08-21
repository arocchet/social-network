import { createEvent } from "@/lib/db/queries/groups/createEvent";
import { respondError, respondSuccess } from '@/lib/server/api/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const eventOwner = req.headers.get("x-user-id");
    const { id: groupId } = await params;
    const { description, title, datetime } = await req.json();

    if (!groupId) {
      return NextResponse.json(respondError("Missing or invalid group ID"), { status: 400 });
    }

    if (!eventOwner) {
      return NextResponse.json(respondError("Missing event owner ID"), { status: 400 });
    }

    if (!title || !description) {
      return NextResponse.json(respondError("Missing title or description"), { status: 400 });
    }

    const data = {
      ownerId: eventOwner,
      groupId,
      title,
      description,
      datetime,
    };

    const event = await createEvent(data);

    return NextResponse.json(respondSuccess(event, "Event created successfully"), { status: 200 });

  } catch (err) {
    console.error("POST: api/public/groups/[id]/events/ Failed to create event: ", err);

    return NextResponse.json(
      respondError(err instanceof Error ? err.message : "Unexpected error"),
      { status: 500 }
    );
  }
}
