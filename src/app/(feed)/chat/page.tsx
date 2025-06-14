"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, Edit } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";

interface MessagesPageProps {
  onBack?: () => void;
  onChatOpen?: (chatId: string) => void;
}

const conversations = [
  {
    id: "1",
    user: {
      username: "alice_photo",
      displayName: "Alice Martin",
      avatar: "/placeholder.svg?height=56&width=56",
      isOnline: true,
    },
    lastMessage: {
      text: "Salut ! Comment ça va ? 😊",
      timestamp: "2min",
      isRead: false,
      isFromMe: false,
    },
    unreadCount: 2,
  },
  {
    id: "2",
    user: {
      username: "bob_travel",
      displayName: "Bob Voyage",
      avatar: "/placeholder.svg?height=56&width=56",
      isOnline: false,
    },
    lastMessage: {
      text: "Merci pour les photos !",
      timestamp: "1h",
      isRead: true,
      isFromMe: true,
    },
    unreadCount: 0,
  },
  {
    id: "3",
    user: {
      username: "clara_art",
      displayName: "Clara Artiste",
      avatar: "/placeholder.svg?height=56&width=56",
      isOnline: true,
    },
    lastMessage: {
      text: "Tu as vu ma dernière œuvre ?",
      timestamp: "3h",
      isRead: true,
      isFromMe: false,
    },
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      username: "david_food",
      displayName: "David Chef",
      avatar: "/placeholder.svg?height=56&width=56",
      isOnline: false,
    },
    lastMessage: {
      text: "La recette était délicieuse ! 🍝",
      timestamp: "1j",
      isRead: true,
      isFromMe: true,
    },
    unreadCount: 0,
  },
  {
    id: "5",
    user: {
      username: "emma_fitness",
      displayName: "Emma Sport",
      avatar: "/placeholder.svg?height=56&width=56",
      isOnline: true,
    },
    lastMessage: {
      text: "On se fait un jogging demain ?",
      timestamp: "2j",
      isRead: false,
      isFromMe: false,
    },
    unreadCount: 1,
  },
];

export default function MessagesPage({ onBack }: MessagesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function onChatOpen(chatId: string) {
    window.location.href = `/chat/${chatId}`;
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel2)]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <div className="flex items-center gap-4">
          <Link href={"/"}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>

          <h1 className="font-semibold text-lg">Messages</h1>
        </div>
        <ModeToggle />
      </header>

      {/* Search */}
      <div className="p-4 border-b border-[var(--detailMinimal)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--textMinimal)] w-4 h-4" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[var(--detailMinimal)]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="pb-24">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--textMinimal)]">
            <div className="text-lg font-medium mb-2">
              Aucune conversation trouvée
            </div>
            <div className="text-sm">Essayez un autre terme de recherche</div>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() => onChatOpen?.(conversation.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: (typeof conversations)[0];
  onClick?: () => void;
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-[var(--bgLevel1)] cursor-pointer border-b border-[var(--detailMinimal)]"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="w-14 h-14">
          <AvatarImage
            src={conversation.user.avatar || "/placeholder.svg"}
            alt={conversation.user.username}
          />
          <AvatarFallback>
            {conversation.user.displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {conversation.user.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--detailMinimal)] rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-[var(--textNeutral)] truncate">
            {conversation.user.displayName}
          </span>
          <span className="text-xs text-[var(--textMinimal)]">
            {conversation.lastMessage.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate ${
              conversation.lastMessage.isRead ||
              conversation.lastMessage.isFromMe
                ? "text-[var(--textMinimal)]"
                : "text-[var(--textNeutral)] font-medium"
            }`}
          >
            {conversation.lastMessage.isFromMe && "Vous: "}
            {conversation.lastMessage.text}
          </span>
          {conversation.unreadCount > 0 && (
            <div className="ml-2 bg-[var(--pink20)] text-[var(--white10)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conversation.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
