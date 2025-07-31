import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Vérifier le statut d'amitié avec un utilisateur spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
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

  const currentUserId = payload.userId;
  const { userId: targetUserId } = await params;

  try {
    // Chercher une relation d'amitié dans les deux sens
    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          {
            userId: currentUserId,
            friendId: targetUserId,
          },
          {
            userId: targetUserId,
            friendId: currentUserId,
          },
        ],
      },
      select: {
        status: true,
        userId: true,
        friendId: true,
      },
    });

    if (!friendship) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "No friendship found",
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      data: { status: friendship.status },
      message: "Friendship status retrieved",
    }, { status: 200 });

  } catch (error) {
    console.error("Error checking friendship status:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}