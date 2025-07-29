
'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, Edit, Users, MessageCircle, Plus } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import { NewChatModal } from "@/components/chat/NewChatModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useConversations } from "@/hooks/use-conversations";
import { formatDate } from "@/app/utils/dateFormat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useState, useEffect } from "react";

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

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('group');

  const { conversations, isLoading, error, refreshConversations } = useConversations();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // This would normally come from an auth context
    // For now, we'll get it from the API response or context
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.user.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (groupId) {
      const fetchGroupInfo = async () => {
        try {
          const response = await fetch(`/api/private/groups/${groupId}`);
          if (response.ok) {
            const data = await response.json();
            setGroupInfo(data.group);
          }
        } catch (error) {
          console.error('Error fetching group info:', error);
        }
      };
      fetchGroupInfo();
    }
  }, [groupId]);

  async function onChatOpen(chatId: string, type: 'direct' | 'group' = 'direct') {
    // Mark conversation as seen when opening
    try {
      if (type === 'group') {
        await fetch(`/api/private/conversations/${chatId}/mark-seen`, {
          method: 'POST'
        });
      } else {
        await fetch(`/api/private/direct-conversations/${chatId}/mark-seen`, {
          method: 'POST'
        });
      }

      // Refresh conversations to update unread counts
      await refreshConversations();

      // Navigate to chat
      if (type === 'group') {
        router.push(`/chat?group=${chatId}`);
      } else {
        router.push(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error('Error marking conversation as seen:', error);
      // Still navigate even if marking as seen fails
      if (type === 'group') {
        router.push(`/chat?group=${chatId}`);
      } else {
        router.push(`/chat/${chatId}`);
      }
    }
  }

  function handleStartNewChat(userId: string) {
    router.push(`/chat/${userId}`);
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const isGroup = conversation.type === 'group';

    if (isGroup) {
      // Search in group title
      return conversation.group?.title?.toLowerCase().includes(query);
    } else {
      // Search in user display name and username
      const displayName = conversation.user?.displayName?.toLowerCase() || '';
      const username = conversation.user?.username?.toLowerCase() || '';
      return displayName.includes(query) || username.includes(query);
    }
  });

  // If we're viewing a group chat, show the chat window directly
  if (groupId && currentUserId) {
    return (
      <div className="min-h-screen bg-[var(--bgLevel2)] flex flex-col">
        {/* Header for group chat */}
        <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)]"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">
                  {groupInfo?.title || 'Groupe'}
                </h1>
                <p className="text-sm text-[var(--textMinimal)]">
                  {groupInfo?.memberCount || 0} membres
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/groups/${groupId}/settings`}>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--bgLevel2)]">
                <Edit className="w-5 h-5" />
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </header>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow
            currentUserId={currentUserId}
            conversationId={groupId}
            type="group"
          />
        </div>
      </div>
    );
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
        <div className="flex items-center gap-2">

          <NewChatModal onStartChat={handleStartNewChat} />
          <ModeToggle />
        </div>
      </header>

      {/* Search */}
      <div className="p-4 border-b border-[var(--detailMinimal)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--textMinimal)] w-4 h-4" />
          <Input
            placeholder="Rechercher des conversations..."
            className="pl-10 border-[var(--detailMinimal)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="pb-24">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-[var(--textMinimal)]">Chargement des conversations...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500">Erreur: {error}</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery.trim() ? (
              <div>
                <div className="text-[var(--textMinimal)]">Aucune conversation trouvée</div>
                <div className="text-sm text-[var(--textMinimal)] mt-2">
                  Essayez avec d'autres mots-clés
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div>
                <div className="text-[var(--textMinimal)]">Aucune conversation</div>
                <div className="text-sm text-[var(--textMinimal)] mt-2">
                  Utilisez le bouton "Nouveau chat" pour commencer une conversation
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() => onChatOpen(conversation.id, conversation.type)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: any;
  onClick?: () => void;
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const isGroup = conversation.type === 'group';
  const displayName = isGroup
    ? conversation.group?.title
    : conversation.user?.displayName;

  const avatar = isGroup
    ? null
    : conversation.user?.avatar;

  const isOnline = !isGroup && conversation.user?.isOnline;


  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-[var(--bgLevel1)] cursor-pointer border-b border-[var(--detailMinimal)]"
      onClick={onClick}
    >
      <div className="relative">
        {isGroup ? (
          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
        ) : (
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={avatar || "/placeholder.svg"}
              alt={conversation.user?.username || 'User'}
            />
            <AvatarFallback>
              {displayName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[var(--detailMinimal)] rounded-full" />
        )}
        <NotificationBadge count={conversation.unreadCount} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--textNeutral)] truncate">
              {displayName}
            </span>
            {isGroup && (
              <span className="text-xs text-[var(--textMinimal)] bg-[var(--bgLevel2)] px-2 py-1 rounded">
                {conversation.group?.memberCount} membres
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--textMinimal)]">
            {formatDate(conversation.lastMessage.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate ${conversation.lastMessage.isRead ||
              conversation.lastMessage.isFromMe
              ? "text-[var(--textMinimal)]"
              : "text-[var(--textNeutral)] font-medium"
              }`}
          >
            {conversation.lastMessage.isFromMe && "Vous: "}
            {conversation.lastMessage.text}
          </span>
        </div>
      </div>
    </div>
  );
}
