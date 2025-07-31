import { db } from "@/lib/db";

/**
 * Check if a user can send messages to another user based on their account privacy settings
 * - Compte privé: peut envoyer message uniquement à ses amis
 * - User public: peut envoyer message uniquement personne public et AMIS
 * - Groupes: n'importe qui PUBLIC ou PRIVÉ à condition que le propriétaire a un lien avec les personnes qui ajoute
 */
export async function canSendMessageTo(senderId: string, receiverId: string): Promise<boolean> {
  if (senderId === receiverId) return true; // Can always message yourself

  // Get both users' account visibility
  const [sender, receiver] = await Promise.all([
    db.user.findUnique({
      where: { id: senderId },
      select: { visibility: true }
    }),
    db.user.findUnique({
      where: { id: receiverId },
      select: { visibility: true }
    })
  ]);

  if (!sender || !receiver) return false;

  // Check if they are friends
  const friendship = await db.friendship.findFirst({
    where: {
      OR: [
        { userId: senderId, friendId: receiverId },
        { userId: receiverId, friendId: senderId }
      ],
      status: "accepted"
    }
  });

  const areFriends = !!friendship;

  // Règles selon le type de compte de l'expéditeur
  if (sender.visibility === "PRIVATE") {
    // Compte privé peut envoyer message uniquement à ses amis
    return areFriends;
  }

  if (sender.visibility === "PUBLIC") {
    // User public peut envoyer message uniquement personne public et AMIS
    if (receiver.visibility === "PUBLIC") return true; // Public vers public
    if (receiver.visibility === "PRIVATE" && areFriends) return true; // Public vers privé si amis
    return false;
  }

  return false;
}

/**
 * Filter conversations based on privacy settings
 * Group conversations are never filtered - anyone in a group can message
 * Direct conversations are filtered based on sender's privacy rules
 */
export async function filterConversationsByVisibility(
  conversations: any[], 
  currentUserId: string
): Promise<any[]> {
  const filteredConversations = [];

  for (const conversation of conversations) {
    // Groupes: n'importe qui PUBLIC ou PRIVÉ peut communiquer dans les groupes
    if (conversation.type === 'group' || conversation.isGroup) {
      filteredConversations.push(conversation);
      continue;
    }

    // For direct conversations, check if current user can send messages to this user
    const canSend = await canSendMessageTo(currentUserId, conversation.user.id);
    if (canSend) {
      filteredConversations.push(conversation);
    }
  }

  return filteredConversations;
}

/**
 * Check if two users are in the same group
 * This allows messaging between group members regardless of privacy settings
 */
export async function areInSameGroup(userId1: string, userId2: string): Promise<boolean> {
  const commonGroups = await db.conversationMember.findFirst({
    where: {
      AND: [
        {
          conversationId: {
            in: await db.conversationMember.findMany({
              where: { 
                userId: userId1,
                conversation: { isGroup: true }
              },
              select: { conversationId: true }
            }).then(members => members.map(m => m.conversationId))
          }
        },
        { 
          userId: userId2,
          conversation: { isGroup: true }
        }
      ]
    }
  });

  return !!commonGroups;
}