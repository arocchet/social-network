"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Phone,
  Video,
  Info,
  Camera,
  ImageIcon,
  Heart,
  Send,
} from "lucide-react";
import { useParams } from "next/navigation";
import { ModeToggle } from "@/components/toggle-theme";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/reaction/emojiPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import Link from "next/link";

interface ChatPageProps {
  chatId: string;
  onBack?: () => void;
}

const chatData = {
  "1": {
    user: {
      username: "alice_photo",
      displayName: "Alice Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    messages: [
      {
        id: "1",
        text: "Salut ! Comment ça va ?",
        timestamp: "14:30",
        isFromMe: false,
        isRead: true,
      },
      {
        id: "2",
        text: "Ça va super bien ! Et toi ?",
        timestamp: "14:32",
        isFromMe: true,
        isRead: true,
      },
      {
        id: "3",
        text: "Très bien aussi ! Tu as vu mes dernières photos ?",
        timestamp: "14:33",
        isFromMe: false,
        isRead: true,
      },
      {
        id: "4",
        text: "Oui elles sont magnifiques ! 😍",
        timestamp: "14:35",
        isFromMe: true,
        isRead: true,
      },
      {
        id: "5",
        text: "Merci beaucoup ! Ça me fait plaisir 😊",
        timestamp: "14:36",
        isFromMe: false,
        isRead: false,
      },
    ],
  },
};

export default function ChatPage({}: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [messages, setMessages] = useState(chatData["1"]?.messages || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = chatData["1"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        timestamp: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isFromMe: true,
        isRead: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleEmojiSelect = (emojiObj: { emoji: string }) => {
    setMessage((prev) => prev + emojiObj.emoji);
    setIsEmojiOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function onBack() {
    window.history.back();
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-[var(--bgLevel2)] flex items-center justify-center">
        <div className="text-[var(--textMinimal)]">
          Conversation non trouvée
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
                src={chat.user.avatar || "/placeholder.svg"}
                alt={chat.user.username}
              />
              <AvatarFallback>
                {chat.user.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {chat.user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--green)] border-1 border-[var(--detailMinimal)] rounded-full" />
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{chat.user.displayName}</div>
            <div className="text-xs text-[var(--textMinimal)]">
              {chat.user.isOnline ? "En ligne" : "Hors ligne"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href={`/profile/${/*chat.user.username*/ ""}`}>
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            userAvatar={chat.user.avatar}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-1 border-[var(--detailMinimal)] p-4 bg-[var(--bgLevel1)]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Camera className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex pr-12 border-[var(--detailMinimal)]"
            />
            <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
              <PopoverTrigger asChild>
                <button className="absolute right-1 top-1/2 -translate-y-1/2 mx-2 py-4">
                  <FaRegFaceSmileBeam className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0 z-[100]">
                <EmojiPicker
                  className="h-[342px]"
                  onEmojiSelect={handleEmojiSelect}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`${
              message.trim()
                ? "bg-[var(--blue)] hover:bg-blue-700 text-[var(--white10)]"
                : "bg-[var(--bgLevel2)] text-[var(--textNeutral)]"
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    timestamp: string;
    isFromMe: boolean;
    isRead: boolean;
  };
  userAvatar: string;
}

function MessageBubble({ message, userAvatar }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-2 ${
        message.isFromMe ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isFromMe && (
        <Avatar className="w-8 h-8 border-1 border-[var(--detailMinimal)]">
          <AvatarImage src={userAvatar || "/placeholder.svg"} alt="User" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-xs lg:max-w-md ${
          message.isFromMe ? "order-1" : "order-2"
        }`}
      >
        <div
          className={`relative inline-block px-4 py-2 rounded-2xl ${
            message.isFromMe
              ? "bg-[var(--blue)] text-[var(--white10)] rounded-br-md"
              : "bg-[var(--white)] text-[var(--grey80)] rounded-bl-md"
          }`}
          style={{ maxWidth: "70vw", wordBreak: "break-word" }}
        >
          <p className="text-sm">{message.text}</p>
          {/* Triangle bubble tail */}
          <span
            className={`
    absolute
    ${
      message.isFromMe
        ? "rotate-65 -right-1 bottom"
        : "-rotate-65 -left-1 bottom"
    }
    w-0 h-0
    border-l-11 border-l-transparent
    border-r-11 border-r-transparent
    border-t-11
    ${message.isFromMe ? "border-t-[var(--blue)]" : "border-t-[var(--white)]"}
  `}
          />
        </div>
      </div>
    </div>
  );
}
