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

  useEffect(() => {
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
        
        // Format direct conversations
        const directConversations: Conversation[] = (directData.conversations || []).map((conv: any) => ({
          ...conv,
          type: 'direct' as const
        }));
        
        // Format group conversations
        const groupConversations: Conversation[] = (groupsData.groups || []).map((group: any) => ({
          id: group.id,
          type: 'group' as const,
          group: group,
          lastMessage: group.lastMessage || {
            text: 'Aucun message',
            timestamp: group.createdAt,
            isRead: true,
            isFromMe: false
          },
          unreadCount: 0 // TODO: implement unread count for groups
        }));
        
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

    loadConversations();
  }, []);

  return { conversations, isLoading, error };
}