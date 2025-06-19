import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ProfileVisibility } from "@prisma/client";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { visibility: true },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ visibility: user.visibility }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Invalid user ID." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const visibilityValue = body.visibility;

    if (visibilityValue !== "PUBLIC" && visibilityValue !== "PRIVATE") {
      return NextResponse.json({ message: "Invalid visibility value." }, { status: 400 });
    }

    const visibility: ProfileVisibility = visibilityValue === "PRIVATE" ? ProfileVisibility.PRIVATE : ProfileVisibility.PUBLIC;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { visibility }
    });

    return NextResponse.json({ 
      success: true,
      visibility: updatedUser.visibility 
    }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      message: "Erreur serveur", 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}