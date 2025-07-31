import { Visibility, Prisma } from "@prisma/client";

interface StoryVisibilityFilterOptions {
  currentUserId?: string;
  targetUserId?: string; // Pour filtrer les stories d'un utilisateur spécifique
  showPrivateStories?: boolean; // Si on veut voir ses propres stories privées  
  targetUserAccountVisibility?: "PUBLIC" | "PRIVATE"; // Visibilité du compte cible
}

/**
 * Construit les filtres Prisma pour la visibilité des stories
 */
export function buildStoryVisibilityFilter({
  currentUserId,
  targetUserId,
  showPrivateStories = false,
  targetUserAccountVisibility,
}: StoryVisibilityFilterOptions): Prisma.StoryWhereInput {
  // Si pas d'utilisateur connecté, ne montrer que les stories publiques
  if (!currentUserId) {
    return {
      visibility: Visibility.PUBLIC,
    };
  }

  // Si on regarde les stories d'un utilisateur spécifique
  if (targetUserId) {
    // Si c'est l'utilisateur lui-même, il peut voir toutes ses stories
    if (currentUserId === targetUserId) {
      return {};
    }

    // Si l'utilisateur cible a un compte PRIVATE, il faut une amitié ACCEPTED
    // ET seules les stories PUBLIC et FRIENDS sont visibles
    if (targetUserAccountVisibility === "PRIVATE") {
      return {
        AND: [
          // D'abord vérifier l'amitié
          {
            user: {
              OR: [
                {
                  friendships: {
                    some: {
                      friendId: currentUserId,
                      status: "accepted" as const,
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted" as const,
                    },
                  },
                },
              ],
            },
          },
          // Puis filtrer selon la visibilité des stories (PUBLIC ou FRIENDS seulement)
          {
            OR: [
              { visibility: Visibility.PUBLIC },
              { visibility: Visibility.FRIENDS },
            ],
          },
        ],
      };
    }
    
    // Si compte PUBLIC, appliquer les règles normales de visibilité des stories
    return {
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            {
              user: {
                OR: [
                  {
                    friendships: {
                      some: {
                        friendId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                  {
                    friendsWithMe: {
                      some: {
                        userId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    };
  }

  // Pour les stories dans le feed avec stories privées personnelles
  if (showPrivateStories) {
    return {
      OR: [
        // Stories de comptes publics avec visibilité PUBLIC
        {
          AND: [
            { visibility: Visibility.PUBLIC },
            { user: { visibility: "PUBLIC" } },
          ],
        },
        // Stories de comptes publics avec visibilité FRIENDS (pour les amis)
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            { user: { visibility: "PUBLIC" } },
            {
              user: {
                OR: [
                  {
                    friendships: {
                      some: {
                        friendId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                  {
                    friendsWithMe: {
                      some: {
                        userId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        // Stories de comptes privés (seulement pour les amis acceptés)
        {
          AND: [
            { user: { visibility: "PRIVATE" } },
            {
              OR: [
                { visibility: Visibility.PUBLIC },
                { visibility: Visibility.FRIENDS },
              ],
            },
            {
              user: {
                OR: [
                  {
                    friendships: {
                      some: {
                        friendId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                  {
                    friendsWithMe: {
                      some: {
                        userId: currentUserId,
                        status: "accepted" as const,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        // Toutes ses propres stories (y compris PRIVATE)
        {
          userId: currentUserId,
        },
      ],
    };
  }

  // Stories feed normal : selon la visibilité du compte ET de la story
  return {
    OR: [
      // Stories PUBLIC de comptes publics - visibles par TOUS (même sans relation, followers et amis)
      {
        AND: [
          { visibility: Visibility.PUBLIC },
          { user: { visibility: "PUBLIC" } },
        ],
      },
      // Stories FRIENDS de comptes publics - seulement pour les AMIS (status: "accepted")
      {
        AND: [
          { visibility: Visibility.FRIENDS },
          { user: { visibility: "PUBLIC" } },
          {
            user: {
              OR: [
                {
                  friendships: {
                    some: {
                      friendId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les stories FRIENDS
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les stories FRIENDS
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      // Stories de comptes privés - seulement pour les AMIS acceptés
      {
        AND: [
          { user: { visibility: "PRIVATE" } },
          {
            OR: [
              { visibility: Visibility.PUBLIC },
              { visibility: Visibility.FRIENDS },
            ],
          },
          {
            user: {
              OR: [
                {
                  friendships: {
                    some: {
                      friendId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les stories de comptes privés
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les stories de comptes privés
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      // Ses propres stories (toujours visibles)
      {
        userId: currentUserId,
      },
    ],
  };
}

/**
 * Vérifie si un utilisateur peut voir une story spécifique
 */
export async function canUserSeeStory(
  storyId: string,
  currentUserId?: string
): Promise<boolean> {
  const { db } = await import("../..");
  const story = await db.story.findUnique({
    where: { id: storyId },
    include: {
      user: {
        select: {
          id: true,
          visibility: true,
          friendships: {
            where: {
              friendId: currentUserId,
              status: "accepted",
            },
          },
          friendsWithMe: {
            where: {
              userId: currentUserId,
              status: "accepted",
            },
          },
        },
      },
    },
  });

  if (!story) return false;

  // L'auteur peut toujours voir ses propres stories
  if (story.userId === currentUserId) return true;

  // Si l'utilisateur qui a posté a un compte PRIVATE
  if (story.user.visibility === "PRIVATE") {
    // Il faut être ami accepté pour voir ses stories (même PUBLIC)
    const isFriend = 
      story.user.friendships.length > 0 || story.user.friendsWithMe.length > 0;
    
    if (!isFriend) return false;
    
    // Si on est ami, on peut voir ses stories PUBLIC et FRIENDS
    return story.visibility === Visibility.PUBLIC || story.visibility === Visibility.FRIENDS;
  }

  // Si l'utilisateur qui a posté a un compte PUBLIC
  if (story.user.visibility === "PUBLIC") {
    // Stories publiques visibles par tous
    if (story.visibility === Visibility.PUBLIC) return true;

    // Stories privées seulement visibles par l'auteur
    if (story.visibility === Visibility.PRIVATE) return false;

    // Stories pour amis seulement visibles par les amis
    if (story.visibility === Visibility.FRIENDS) {
      const isFriend =
        story.user.friendships.length > 0 || story.user.friendsWithMe.length > 0;
      return isFriend;
    }
  }

  return false;
}