import { db } from "@/lib/db";

export async function getAllStoriesGrouped(
  currentUserId: string,
  publicOnly: boolean = false
) {
  const stories = await db.story.findMany({
    where: {
      ...(publicOnly ? { visibility: "PUBLIC" } : {}),
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
      reactions: {
        where: {
          type: "LIKE",
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      datetime: "asc",
    },
  });

  // Enrichir chaque story avec les infos de likes
  const enrichedStories = stories.map((story: any) => ({
    ...story,
    likesCount: story.reactions.length,
    isLikedByCurrentUser: story.reactions.some(
      (reaction: { userId: string }) => reaction.userId === currentUserId
    ),
  }));

  // ✅ CORRECTION : Utiliser enrichedStories au lieu de stories
  const groupedStories = enrichedStories.reduce((acc, story) => {
    const userId = story.user.id;

    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
        hasUnviewed: true,
      };
    }

    // ✅ IMPORTANT : Pousser la story enrichie avec le bon format
    acc[userId].stories.push({
      id: story.id, // ✅ Vrai ID de la DB
      image: story.media, // ✅ URL de l'image/vidéo
      timeAgo: getTimeAgo(story.datetime), // ✅ Formaté correctement
      mediaType: story.media.includes(".mp4") ? "video" : "image",
      likesCount: story.likesCount,
      isLikedByCurrentUser: story.isLikedByCurrentUser,
    });

    return acc;
  }, {} as Record<string, any>);

  // Convertir en array et trier par story la plus récente
  return Object.values(groupedStories).sort((a: any, b: any) => {
    const latestA = Math.max(
      ...a.stories.map((s: any) => new Date(s.datetime || 0).getTime())
    );
    const latestB = Math.max(
      ...b.stories.map((s: any) => new Date(s.datetime || 0).getTime())
    );
    return latestB - latestA;
  });
}

// ✅ Fonction helper pour formater le temps
function getTimeAgo(datetime: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - datetime.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "maintenant";
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${Math.floor(diffInHours / 24)}j`;
}
