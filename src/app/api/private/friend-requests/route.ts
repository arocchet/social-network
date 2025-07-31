import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateFriendRequestSchema = z.object({
  friendId: z.string(),
});

// GET: Récupérer les demandes d'amis reçues
export async function GET(req: NextRequest) {
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
    const friendRequests = await db.friendship.findMany({
      where: {
        friendId: userId,
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      friendRequests: friendRequests.map((request) => ({
        id: request.id,
        user: request.user,
        createdAt: request.createdAt,
      })),
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

// POST: Créer/Annuler une demande d'ami
export async function POST(req: NextRequest) {
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
    const { friendId } = CreateFriendRequestSchema.parse(body);

    // Vérifier que l'utilisateur ne s'ajoute pas lui-même
    if (friendId === userId) {
      return NextResponse.json({ 
        message: "Cannot send friend request to yourself" 
      }, { status: 400 });
    }

    // Vérifier si l'utilisateur cible existe
    const targetUser = await db.user.findUnique({
      where: { id: friendId },
      select: { id: true, username: true },
    });

    if (!targetUser) {
      return NextResponse.json({ 
        message: "User not found" 
      }, { status: 404 });
    }

    // Vérifier si une relation d'amitié existe déjà (dans les deux sens)
    const existingFriendship = await db.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existingFriendship) {
      // Si elle existe, la supprimer
      await db.$transaction(async (tx) => {
        // Supprimer la relation principale
        await tx.friendship.delete({
          where: { id: existingFriendship.id },
        });

        // Si c'était une amitié acceptée, supprimer aussi la relation inverse
        if (existingFriendship.status === "accepted") {
          const reverseFriendship = await tx.friendship.findFirst({
            where: {
              userId: existingFriendship.userId === userId ? friendId : userId,
              friendId: existingFriendship.userId === userId ? userId : friendId,
            },
          });

          if (reverseFriendship) {
            await tx.friendship.delete({
              where: { id: reverseFriendship.id },
            });
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: null,
        message: existingFriendship.status === "accepted" ? "Friendship removed" : "Friend request canceled",
      }, { status: 200 });
    } else {
      // Créer une nouvelle demande d'ami
      const newFriendship = await db.friendship.create({
        data: {
          userId: userId,
          friendId: friendId,
          status: "pending",
        },
      });

      return NextResponse.json({
        success: true,
        data: { status: newFriendship.status },
        message: "Friend request sent",
      }, { status: 201 });
    }

  } catch (error) {
    console.error("Error creating friend request:", error);
    
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