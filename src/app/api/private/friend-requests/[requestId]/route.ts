import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateFriendRequestSchema = z.object({
  action: z.enum(["ACCEPT", "DECLINE"]),
});

// PATCH: Accepter ou refuser une demande d'ami
export async function PATCH(
  req: NextRequest,
  { params }: { params: { requestId: string } }
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

  const userId = payload.userId;
  const { requestId } = await params;

  try {
    const body = await req.json();
    const { action } = UpdateFriendRequestSchema.parse(body);

    // Vérifier que la demande existe et appartient à l'utilisateur
    const friendship = await db.friendship.findFirst({
      where: {
        id: requestId,
        friendId: userId,
        status: "pending",
      },
    });

    if (!friendship) {
      return NextResponse.json({ 
        message: "Friend request not found or already processed" 
      }, { status: 404 });
    }

    if (action === "ACCEPT") {
      // Accepter la demande et créer une amitié bidirectionnelle
      await db.$transaction(async (tx) => {
        // 1. Accepter la demande existante
        await tx.friendship.update({
          where: { id: requestId },
          data: { status: "accepted" },
        });

        // 2. Créer l'amitié inverse (bidirectionnelle)
        // friendship contient: userId (qui a envoyé) -> friendId (qui a reçu)
        // On crée: friendId -> userId
        const existingFriendship = await tx.friendship.findUnique({
          where: { id: requestId },
          select: { userId: true, friendId: true },
        });

        if (existingFriendship) {
          // Vérifier si l'amitié inverse existe déjà
          const reverseFriendship = await tx.friendship.findFirst({
            where: {
              userId: existingFriendship.friendId,
              friendId: existingFriendship.userId,
            },
          });

          // Créer l'amitié inverse seulement si elle n'existe pas
          if (!reverseFriendship) {
            await tx.friendship.create({
              data: {
                userId: existingFriendship.friendId,
                friendId: existingFriendship.userId,
                status: "accepted",
              },
            });
          }
        }
      });

      return NextResponse.json({
        success: true,
        message: "Friend request accepted",
      }, { status: 200 });

    } else if (action === "DECLINE") {
      // Refuser et supprimer la demande
      await db.friendship.delete({
        where: { id: requestId },
      });

      return NextResponse.json({
        success: true,
        message: "Friend request declined",
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error updating friend request:", error);
    
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