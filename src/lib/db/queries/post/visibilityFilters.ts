import { Visibility } from "@prisma/client";

interface VisibilityFilterOptions {
  currentUserId?: string;
  targetUserId?: string; // Pour filtrer les posts d'un utilisateur spécifique
  showPrivatePosts?: boolean; // Si on veut voir ses propres posts privés
  targetUserAccountVisibility?: "PUBLIC" | "PRIVATE"; // Visibilité du compte cible
}

/**
 * Construit les filtres Prisma pour la visibilité des posts
 */
export function buildPostVisibilityFilter({
  currentUserId,
  targetUserId,
  showPrivatePosts = false,
  targetUserAccountVisibility,
}: VisibilityFilterOptions) {
  // Si pas d'utilisateur connecté, ne montrer que les posts publics
  if (!currentUserId) {
    return {
      visibility: Visibility.PUBLIC,
    };
  }

  // Si on regarde les posts d'un utilisateur spécifique
  if (targetUserId) {
    // Si c'est l'utilisateur lui-même, il peut voir tous ses posts
    if (currentUserId === targetUserId) {
      return {};
    }

    // Si l'utilisateur cible a un compte PRIVATE, il faut une amitié ACCEPTED
    // ET seuls les posts PUBLIC et FRIENDS sont visibles
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
                      status: "accepted",
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted",
                    },
                  },
                },
              ],
            },
          },
          // Puis filtrer selon la visibilité des posts (PUBLIC ou FRIENDS seulement)
          {
            OR: [
              { visibility: Visibility.PUBLIC },
              { visibility: Visibility.FRIENDS },
            ],
          },
        ],
      };
    }
    
    // Si compte PUBLIC, appliquer les règles normales de visibilité des posts
    return {
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            {
              user: {
                friendships: {
                  some: {
                    friendId: currentUserId,
                    status: "accepted",
                  },
                },
              },
            },
          ],
        },
        {
          AND: [
            { visibility: Visibility.FRIENDS },
            {
              user: {
                friendsWithMe: {
                  some: {
                    userId: currentUserId,
                    status: "accepted",
                  },
                },
              },
            },
          ],
        },
      ],
    };
  }

  // Pour le feed général avec posts privés personnels
  if (showPrivatePosts) {
    return {
      OR: [
        // Posts de comptes publics avec visibilité PUBLIC
        {
          AND: [
            { visibility: Visibility.PUBLIC },
            { user: { visibility: "PUBLIC" } },
          ],
        },
        // Posts de comptes publics avec visibilité FRIENDS (pour les amis)
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
                        status: "accepted",
                      },
                    },
                  },
                  {
                    friendsWithMe: {
                      some: {
                        userId: currentUserId,
                        status: "accepted",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        // Posts de comptes privés (seulement pour les amis acceptés)
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
                        status: "accepted",
                      },
                    },
                  },
                  {
                    friendsWithMe: {
                      some: {
                        userId: currentUserId,
                        status: "accepted",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        // Tous ses propres posts (y compris PRIVATE)
        {
          userId: currentUserId,
        },
      ],
    };
  }

  // Feed normal : posts selon la visibilité du compte ET du post
  return {
    OR: [
      // Posts PUBLIC de comptes publics - visibles par TOUS (même sans relation, followers et amis)
      {
        AND: [
          { visibility: Visibility.PUBLIC },
          { user: { visibility: "PUBLIC" } },
        ],
      },
      // Posts FRIENDS de comptes publics - seulement pour les AMIS (status: "accepted")
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
                      status: "accepted", // Seulement les AMIS peuvent voir les posts FRIENDS
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les posts FRIENDS
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      // Posts de comptes privés - seulement pour les AMIS acceptés
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
                      status: "accepted", // Seulement les AMIS peuvent voir les posts de comptes privés
                    },
                  },
                },
                {
                  friendsWithMe: {
                    some: {
                      userId: currentUserId,
                      status: "accepted", // Seulement les AMIS peuvent voir les posts de comptes privés
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      // Ses propres posts (toujours visibles)
      {
        userId: currentUserId,
      },
    ],
  };
}

/**
 * Vérifie si un utilisateur peut voir un post spécifique
 */
export async function canUserSeePost(
  postId: string,
  currentUserId?: string
): Promise<boolean> {
  const { db } = await import("../..");
  const post = await db.post.findUnique({
    where: { id: postId },
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

  if (!post) return false;

  // L'auteur peut toujours voir ses propres posts
  if (post.userId === currentUserId) return true;

  // Si l'utilisateur qui a posté a un compte PRIVATE
  if (post.user.visibility === "PRIVATE") {
    // Il faut être ami accepté pour voir ses posts (même PUBLIC)
    const isFriend = 
      post.user.friendships.length > 0 || post.user.friendsWithMe.length > 0;
    
    if (!isFriend) return false;
    
    // Si on est ami, on peut voir ses posts PUBLIC et FRIENDS
    return post.visibility === Visibility.PUBLIC || post.visibility === Visibility.FRIENDS;
  }

  // Si l'utilisateur qui a posté a un compte PUBLIC
  if (post.user.visibility === "PUBLIC") {
    // Posts publics visibles par tous
    if (post.visibility === Visibility.PUBLIC) return true;

    // Posts privés seulement visibles par l'auteur
    if (post.visibility === Visibility.PRIVATE) return false;

    // Posts pour amis seulement visibles par les amis
    if (post.visibility === Visibility.FRIENDS) {
      const isFriend =
        post.user.friendships.length > 0 || post.user.friendsWithMe.length > 0;
      return isFriend;
    }
  }

  return false;
}