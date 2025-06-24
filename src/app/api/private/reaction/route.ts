import { updateStoryReaction } from "@/lib/db/queries/stories/updateStoryReaction";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "invalid user ID" }, { status: 401 });
  }

  const data = await req.json();

  try {
    await updateStoryReaction(userId, data);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    throw new Error("Error updating reaction");
  }
}
