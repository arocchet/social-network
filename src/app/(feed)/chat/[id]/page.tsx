"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Info,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import Link from "next/link";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user-data";

interface ChatPageProps {
  chatId: string;
  onBack?: () => void;

}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const { user } = useUser()
  const currentUserId = user?.id;
  useEffect(() => {
    params.then(p => setReceiverId(p.id));
  }, [params]);

  // Fetch user information for the chat header
  useEffect(() => {
    if (receiverId) {
      fetch(`/api/private/user/${receiverId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setChatUser(data.user);
          }
        })
        .catch(err => console.error('Error fetching user:', err));
    }
  }, [receiverId]);

  function onBack() {
    window.history.back();
  }

  if (!receiverId) {
    return (
      <div className="min-h-screen bg-[var(--bgLevel2)] flex items-center justify-center">
        <div className="text-[var(--textMinimal)]">
          Chargement...
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[var(--bgLevel2)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-3.5 border-b border-[var(--detailMinimal)]  sticky top-0 bg-[var(--bgLevel1)] z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-[var(--bgLevel2)] cursor-pointer ml-0.5"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="relative">
            <Avatar className="w-10 h-10 border-1 border-[var(--detailMinimal)]">
              <AvatarImage
                src={chatUser?.avatar || "/placeholder.svg"}
                alt={chatUser?.username || "User"}
              />
              <AvatarFallback>
                {chatUser?.firstName?.[0]?.toUpperCase() || chatUser?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* TODO: Add online status */}
          </div>
          <div>
            <div className="font-medium text-sm">
              {chatUser?.firstName && chatUser?.lastName
                ? `${chatUser.firstName} ${chatUser.lastName}`
                : chatUser?.username || "Utilisateur"}
            </div>
            <div className="text-xs text-[var(--textMinimal)]">
              {/* TODO: Add online status */}
              En ligne
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href={`/profile/${chatUser?.id || receiverId}`}>
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Real-time Chat Window */}
      <ChatWindow
        currentUserId={currentUserId!}
        receiverId={receiverId}
        type="direct"
      />
    </div>
  );
}

