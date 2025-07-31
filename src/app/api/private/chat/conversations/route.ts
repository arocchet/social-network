import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { filterConversationsByVisibility } from '@/lib/db/queries/messages/visibilityFilters';

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent direct messages for this user
    const recentMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
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
        datetime: 'desc',
      },
      take: 100,
    });

    // Get group conversations for this user
    const userGroups = await db.conversationMember.findMany({
      where: { 
        userId,
        conversation: { isGroup: true }
      },
      include: {
        conversation: {
          include: {
            members: {
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
            },
            messages: {
              orderBy: { sentAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('🔍 DEBUG: Found', userGroups.length, 'groups for user', userId);

    const conversationMap = new Map();
    
    // Process direct messages - group by conversation partner
    const conversationPartners = new Map();
    
    recentMessages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;
      
      // Only keep the most recent message per partner
      if (!conversationPartners.has(partnerId) || 
          message.datetime > conversationPartners.get(partnerId).message.datetime) {
        conversationPartners.set(partnerId, { message, partner });
      }
    });

    // Create conversation entries from deduplicated partners
    conversationPartners.forEach(({ message, partner }, partnerId) => {
      if (partner && partner.username) { // Ensure partner data exists
        conversationMap.set(partnerId, {
          id: partnerId,
          type: 'direct',
          user: {
            id: partner.id,
            username: partner.username,
            displayName: partner.firstName && partner.lastName 
              ? `${partner.firstName} ${partner.lastName}` 
              : partner.username,
            avatar: partner.avatar,
            isOnline: false,
          },
          lastMessage: {
            text: message.message,
            timestamp: message.datetime,
            isRead: true,
            isFromMe: message.senderId === userId,
          },
          unreadCount: 0,
        });
      }
    });

    // Process group conversations - ensure no duplicates
    userGroups.forEach(conversationMember => {
      const group = conversationMember.conversation;
      if (!group || !group.isGroup) return; // Skip non-group conversations
      
      const groupId = group.id; // Use the actual group id, not prefixed
      
      console.log('🔍 DEBUG: Processing group', group.id, 'with', group.members?.length || 0, 'members');
      
      // Only add if not already processed
      if (!conversationMap.has(groupId)) {
        const lastMessage = group.messages?.[0];
        
        conversationMap.set(groupId, {
          id: group.id,
          type: 'group',
          isGroup: true,
          groupName: group.title || 'Groupe',
          memberCount: group.members?.length || 0,
          members: group.members?.map(m => ({
            id: m.user.id,
            username: m.user.username,
            displayName: m.user.firstName && m.user.lastName 
              ? `${m.user.firstName} ${m.user.lastName}` 
              : m.user.username,
            avatar: m.user.avatar,
          })) || [],
          lastMessage: lastMessage ? {
            text: lastMessage.message,
            timestamp: lastMessage.sentAt,
            isRead: true,
            isFromMe: lastMessage.senderId === userId,
            senderName: lastMessage.sender?.username || 'Utilisateur',
          } : {
            text: 'Aucun message',
            timestamp: new Date(),
            isRead: true,
            isFromMe: false,
            senderName: '',
          },
          unreadCount: 0,
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

    console.log('🔍 DEBUG: Total conversations before filtering:', conversations.length);
    console.log('🔍 DEBUG: Conversation types:', conversations.map(c => ({ id: c.id, type: c.type, isGroup: c.isGroup })));

    // Filter conversations based on privacy settings
    // Group conversations are not filtered, only direct conversations
    const filteredConversations = await filterConversationsByVisibility(conversations, userId);

    console.log('🔍 DEBUG: Total conversations after filtering:', filteredConversations.length);

    return NextResponse.json({ conversations: filteredConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}