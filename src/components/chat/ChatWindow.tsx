'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useRealTimeChat } from '@/hooks/use-real-time-chat';

interface ChatWindowProps {
  currentUserId: string;
  receiverId?: string;
  conversationId?: string;
  type?: 'direct' | 'group';
}

export function ChatWindow({
  currentUserId,
  receiverId,
  conversationId,
  type = 'direct'
}: ChatWindowProps) {
  const {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    typingUsers,
    typingUsersData,
    sendTypingStatus
  } = useRealTimeChat({
    receiverId,
    conversationId,
    type,
  }); const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing functionality
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }

    // Reset the timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 3000);
  }, [isTyping, sendTypingStatus]);

  const handleStopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      sendTypingStatus(false);
    }
  }, [isTyping, sendTypingStatus]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]); // Also scroll when typing status changes

  // Mark conversation as seen when messages are loaded or updated
  useEffect(() => {
    if (messages.length > 0 && (conversationId || receiverId)) {
      const markAsSeen = async () => {
        try {
          const chatId = conversationId || receiverId;
          const apiPath = type === 'direct'
            ? `/api/private/direct-conversations/${chatId}/mark-seen`
            : `/api/private/conversations/${chatId}/mark-seen`;

          await fetch(apiPath, {
            method: 'POST'
          });

          console.log(`${type} conversation marked as seen, status updates sent via Redis`);
        } catch (error) {
          console.error('Error marking conversation as seen:', error);
        }
      };

      markAsSeen();
    }
  }, [messages, conversationId, receiverId, type]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Chargement des messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
          Reconnexion en cours...
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Aucun message pour le moment</p>
              <p className="text-sm mt-1">Commencez une conversation !</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        {/* Typing indicator */}
        <TypingIndicator typingUsers={typingUsers} typingUsersData={typingUsersData} />

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={sendMessage}
        isConnected={isConnected}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
}