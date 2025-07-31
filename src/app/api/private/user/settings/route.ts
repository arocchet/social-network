import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateUserSettingsSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await verifyJwt(token);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = payload.userId;

  try {
    const body = await req.json();
    const validatedData = UpdateUserSettingsSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        visibility: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: "Settings updated successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating user settings:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Invalid request data",
        errors: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}