'use client';
import { useEffect, useState } from 'react';

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isOnline: boolean;
  };
  group?: {
    id: string;
    title: string;
    memberCount: number;
    members: Array<{
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    }>;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    isFromMe: boolean;
  };
  unreadCount: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh conversations
  const refreshConversations = async () => {
    await loadConversations();
  };

  // Simple function to get unread count for a conversation
  const getUnreadCountForConversation = async (conversationId: string, type: 'direct' | 'group') => {
    try {
      if (type === 'direct') {
        // For direct messages, count unread messages from this sender
        const response = await fetch(`/api/private/messages?senderId=${conversationId}&unreadOnly=true`);
        if (response.ok) {
          const data = await response.json();
          return data.messages?.length || 0;
        }
      } else {
        // For groups, count unread messages in this conversation
        const response = await fetch(`/api/private/conversations/${conversationId}/unread-count`);
        if (response.ok) {
          const data = await response.json();
          return data.count || 0;
        }
      }
    } catch (error) {
      console.error('Error getting unread count:', error);
    }
    return 0;
  };

  const loadConversations = async () => {
      try {
        setIsLoading(true);
        
        // Load both direct conversations and groups
        const [directResponse, groupsResponse] = await Promise.all([
          fetch(`/api/private/chat/conversations`),
          fetch(`/api/private/groups`)
        ]);
        
        const directData = directResponse.ok ? await directResponse.json() : { conversations: [] };
        const groupsData = groupsResponse.ok ? await groupsResponse.json() : { groups: [] };
        
        // Format direct conversations with real unread data
        const directConversations: Conversation[] = await Promise.all(
          (directData.conversations || []).map(async (conv: any) => {
            // For direct conversations, use the user.id (the other person's ID) to count unread messages from them
            const otherUserId = conv.user?.id;
            return {
              ...conv,
              type: 'direct' as const,
              unreadCount: await getUnreadCountForConversation(otherUserId, 'direct')
            };
          })
        );
        
        // Format group conversations with real unread data
        const groupConversations: Conversation[] = await Promise.all(
          (groupsData.groups || []).map(async (group: any) => ({
            id: group.id,
            type: 'group' as const,
            group: group,
            lastMessage: group.lastMessage || {
              text: 'Aucun message',
              timestamp: group.createdAt,
              isRead: true,
              isFromMe: false
            },
            unreadCount: await getUnreadCountForConversation(group.id, 'group')
          }))
        );
        
        // Combine and sort by last message timestamp
        const allConversations = [...directConversations, ...groupConversations];
        allConversations.sort((a, b) => 
          new Date(b.lastMessage.timestamp).getTime() - 
          new Date(a.lastMessage.timestamp).getTime()
        );
        
        setConversations(allConversations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    loadConversations();
  }, []);

  return { conversations, isLoading, error, refreshConversations };
}