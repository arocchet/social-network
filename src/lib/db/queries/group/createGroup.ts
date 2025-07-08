import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function createGroupInDb(
  userIds: string[],
  title: string
): Promise<NextResponse> {
  try {
    if (!userIds || userIds.length < 2) {
      return NextResponse.json(
        { error: "Au moins deux membres sont requis pour un groupe." },
        { status: 400 }
      );
    }

    const group = await db.conversation.create({
      data: {
        title,
        isGroup: true,
        members: {
          create: userIds.map((id) => ({
            user: { connect: { id } },
          })),
        },
      },
      include: {
        members: { include: { user: true } },
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
