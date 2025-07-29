'use client';
import { useEffect, useState, useRef } from 'react';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  conversationId?: string;
  message: string;
  timestamp: string;
  type: 'direct' | 'group';
  eventId?: string; // Add eventId for event messages
  status?: 'SENT' | 'DELIVERED' | 'READ';
  deliveredAt?: string;
  readAt?: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface UseRealTimeChatProps {
  receiverId?: string;
  conversationId?: string;
  type?: 'direct' | 'group';
}

export function useRealTimeChat({ 
  receiverId, 
  conversationId, 
  type = 'direct' 
}: UseRealTimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          type,
          ...(type === 'direct' && receiverId ? { receiverId } : {}),
          ...(type === 'group' && conversationId ? { conversationId } : {}),
        });

        const response = await fetch(`/api/private/chat/messages?${params}`);
        const data = await response.json();
        
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [receiverId, conversationId, type]);

  // Set up real-time connection
  useEffect(() => {
    const params = new URLSearchParams({
      type,
      ...(type === 'direct' && receiverId ? { conversationId: receiverId } : {}),
      ...(type === 'group' && conversationId ? { conversationId } : {}),
    });

    const eventSource = new EventSource(`/api/private/chat/listen?${params}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('Connected to real-time chat');
          return;
        }

        if (data.type === 'message_status_update') {
          // Update message status
          console.log('Received status update:', data);
          setMessages(prev => {
            const updated = prev.map(msg => {
              if (msg.id === data.messageId) {
                console.log(`Updating message ${msg.id} from status ${msg.status} to ${data.status}`);
                return { 
                  ...msg, 
                  status: data.status,
                  deliveredAt: data.deliveredAt,
                  readAt: data.readAt
                };
              }
              return msg;
            });
            console.log('Messages after status update:', updated.filter(m => m.id === data.messageId));
            return updated;
          });
          return;
        }

        // Add new message to the list
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) return prev;
          
          return [...prev, data];
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [receiverId, conversationId, type]);

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/private/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: type === 'direct' ? receiverId : undefined,
          conversationId: type === 'group' ? conversationId : undefined,
          message,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
  };
}