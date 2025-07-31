// lib/server/stories/getStories.ts

import { db } from "@/lib/db";
import { buildStoryVisibilityFilter } from "@/lib/db/queries/stories/visibilityFilters";

export async function getStoriesByUserId(userId: string, currentUserId?: string) {
  // Récupérer d'abord les infos de l'utilisateur cible pour connaître sa visibilité
  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { visibility: true },
  });

  if (!targetUser) {
    return [];
  }

  const visibilityFilter = buildStoryVisibilityFilter({
    currentUserId,
    targetUserId: userId,
    targetUserAccountVisibility: targetUser.visibility,
  });

  console.log('🔍 Stories visibilityFilter:', JSON.stringify(visibilityFilter, null, 2));
  console.log('🔍 currentUserId:', currentUserId, 'targetUserId:', userId);

  return await db.story.findMany({
    where: {
      userId: userId,
      datetime: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      ...visibilityFilter,
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
      _count: {
        select: {
          reactions: true,
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
  const visibilityFilter = publicOnly 
    ? { visibility: "PUBLIC" as const }
    : buildStoryVisibilityFilter({ currentUserId });

  const stories = await db.story.findMany({
    where: {
      datetime: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      ...visibilityFilter,
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
      _count: {
        select: {
          reactions: true,
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
        hasUnviewed: true,
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

export async function getStoryById(storyId: string, currentUserId?: string) {
  // D'abord vérifier si l'utilisateur peut voir cette story
  const { canUserSeeStory } = await import("@/lib/db/queries/stories/visibilityFilters");
  const canSee = await canUserSeeStory(storyId, currentUserId);
  
  if (!canSee) {
    return null;
  }

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
      _count: {
        select: {
          reactions: true,
        },
      },
    },
  });
}
