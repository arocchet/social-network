import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Récupérer l'ID utilisateur depuis les headers
    const userId = req.headers.get("x-user-id");
    const resolvedParams = await params;
    const { id: storyId } = resolvedParams;

    // 2. Vérifications de base
    if (!userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    if (!storyId) {
      return NextResponse.json(
        { message: "ID de story requis" },
        { status: 400 }
      );
    }

    // 3. Vérifier si la story existe
    const story = await db.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json(
        { message: "Story non trouvée" },
        { status: 404 }
      );
    }

    // 4. Vérifier si l'utilisateur a déjà liké cette story
    const existingLike = await db.reaction.findFirst({
      where: {
        storyId,
        userId,
        type: "LIKE",
      },
    });

    if (existingLike) {
      // 5a. Si il a déjà liké, on supprime le like
      await db.reaction.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Compter les likes restants
      const likesCount = await db.reaction.count({
        where: {
          storyId,
          type: "LIKE",
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        likesCount,
        message: "Like supprimé",
      });
    } else {
      // 5b. Si il n'a pas liké, on ajoute le like
      await db.reaction.create({
        data: {
          storyId,
          userId,
          type: "LIKE",
          // postId n'est pas requis car il est optionnel dans votre schéma
        },
      });

      // Compter les likes après ajout
      const likesCount = await db.reaction.count({
        where: {
          storyId,
          type: "LIKE",
        },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        likesCount,
        message: "Story likée",
      });
    }
  } catch (error) {
    console.error("Erreur lors du toggle like:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const resolvedParams = await params;
    const { id: storyId } = resolvedParams;

    if (!userId) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Compter le nombre total de likes
    const likesCount = await db.reaction.count({
      where: {
        storyId,
        type: "LIKE",
      },
    });

    // Vérifier si l'utilisateur actuel a liké
    const userLike = await db.reaction.findFirst({
      where: {
        storyId,
        userId,
        type: "LIKE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        likesCount,
        isLiked: !!userLike,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des likes:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
