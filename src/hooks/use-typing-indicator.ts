'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

interface TypingIndicatorProps {
  receiverId?: string;
  conversationId?: string;
  type?: 'direct' | 'group';
}

export function useTypingIndicator({ 
  receiverId, 
  conversationId, 
  type = 'direct' 
}: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fonction pour envoyer le statut de frappe
  const sendTypingStatus = useCallback(async (typing: boolean) => {
    try {
      await fetch('/api/private/chat/typing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: type === 'direct' ? receiverId : undefined,
          conversationId: type === 'group' ? conversationId : undefined,
          type,
          isTyping: typing,
        }),
      });
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  }, [receiverId, conversationId, type]);

  // Fonction appelée quand l'utilisateur tape
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }

    // Reset le timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Arrêter de taper après 3 secondes d'inactivité
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 3000);
  }, [isTyping, sendTypingStatus]);

  // Fonction pour arrêter explicitement de taper (quand on envoie un message)
  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      sendTypingStatus(false);
    }
  }, [isTyping, sendTypingStatus]);

  // Écouter les notifications de frappe des autres utilisateurs
  useEffect(() => {
    const params = new URLSearchParams({
      type,
      ...(type === 'direct' && receiverId ? { conversationId: receiverId } : {}),
      ...(type === 'group' && conversationId ? { conversationId } : {}),
    });

    const eventSource = new EventSource(`/api/private/chat/typing/listen?${params}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'typing_status') {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            if (data.isTyping) {
              newSet.add(data.userId);
            } else {
              newSet.delete(data.userId);
            }
            return newSet;
          });

          // Auto-remove typing status after 5 seconds
          if (data.isTyping) {
            setTimeout(() => {
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
              });
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Error parsing typing status:', error);
      }
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [receiverId, conversationId, type]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        sendTypingStatus(false);
      }
    };
  }, [isTyping, sendTypingStatus]);

  return {
    typingUsers,
    handleTyping,
    stopTyping,
    isTyping,
  };
}
