// lib/server/stories/getStories.ts

import { db } from "@/lib/db";

export async function getStoriesByUserId(userId: string) {
  return await db.story.findMany({
    where: {
      userId: userId,
      // Optionnel : filtrer les stories de moins de 24h
      datetime: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 heures
      },
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
      datetime: "desc",
    },
  });
}

export async function getAllStoriesGrouped(
  currentUserId: string,
  publicOnly: boolean = false
) {
  const stories = await db.story.findMany({
    where: {
      // Filtrer selon la visibilité
      ...(publicOnly ? { visibility: "PUBLIC" } : {}),
      // Exclure les stories de l'utilisateur actuel si souhaité
      // userId: { not: currentUserId },
      // Stories de moins de 24h
      // datetime: {
      //     gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      // }
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

  // Grouper les stories par utilisateur
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user.id;

    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
        hasUnviewed: true, // À implémenter avec un système de vues
      };
    }

    acc[userId].stories.push(story);
    return acc;
  }, {} as Record<string, any>);

  // Convertir en array et trier par story la plus récente
  return Object.values(groupedStories).sort((a: any, b: any) => {
    const latestA = Math.max(
      ...a.stories.map((s: any) => new Date(s.datetime).getTime())
    );
    const latestB = Math.max(
      ...b.stories.map((s: any) => new Date(s.datetime).getTime())
    );
    return latestB - latestA;
  });
}

export async function getStoryById(storyId: string) {
  return await db.story.findUnique({
    where: { id: storyId },
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
  });
}
