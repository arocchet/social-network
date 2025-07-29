'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageStatusIcons } from "@/components/ui/message-status-icons";
import { formatDistanceToNow } from "date-fns";
import { CalendarFold } from "lucide-react";

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) ||
    /giphy\.com\/gifs\//i.test(url) ||
    /tenor\.com\/view/i.test(url);
}

function convertGiphyUrl(url: string): string {
  const match = url.match(/giphy\.com\/gifs\/(?:.+-)?([a-zA-Z0-9]+)$/);
  if (match?.[1]) {
    return `https://media.giphy.com/media/${match[1]}/giphy.gif`;
  }
  return url;
}

// 🔄 Conversion Tenor -> lien image
function convertTenorUrl(url: string): string {
  const match = url.match(/tenor\.com\/view\/.+-(\d+)/);
  if (match?.[1]) {
    return `https://media.tenor.com/images/${match[1]}/tenor.gif`;
  }
  return url;
}

// 🔁 Retourne une URL image directe
function toDirectImageUrl(url: string): string {
  if (url.includes('giphy.com')) return convertGiphyUrl(url);
  if (url.includes('tenor.com')) return convertTenorUrl(url);
  return url;
}

// 🔧 Parse les messages avec texte + image
function parseMessage(message: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: Array<{ type: 'text' | 'image' | 'link', content: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      const text = message.slice(lastIndex, match.index);
      if (text.trim()) {
        parts.push({ type: 'text', content: text });
      }
    }

    const url = match[0];
    if (isImageUrl(url)) {
      parts.push({ type: 'image', content: toDirectImageUrl(url) });
    } else {
      parts.push({ type: 'link', content: url });
    }

    lastIndex = match.index + url.length;
  }

  if (lastIndex < message.length) {
    const text = message.slice(lastIndex);
    if (text.trim()) {
      parts.push({ type: 'text', content: text });
    }
  }

  return parts.length ? parts : [{ type: 'text', content: message }];
}

interface ChatMessageProps {
  message: {
    id: string;
    senderId: string;
    message: string;
    timestamp: string;
    eventId?: string; // Add eventId to identify event messages
    status?: 'SENT' | 'DELIVERED' | 'READ';
    deliveredAt?: string;
    readAt?: string;
    sender: {
      id: string;
      username: string;
      avatar?: string;
    };
  };
  currentUserId: string;
}

export function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isFromCurrentUser = message.senderId === currentUserId;
  const isEventMessage = !!message.eventId;
  const parsedContent = parseMessage(message.message);

  // Special rendering for event messages
  if (isEventMessage) {
    return (
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex justify-center">
          <div className=" bg-[var(--bgLevel1)] border-2 border-[var(--detailMinimal)]  rounded-xl p-4 max-w-md mx-4 shadow-sm">
            {/* Event icon and sender */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[var(--bgLevel2)] p-2 rounded-full flex items-center justify-center">
                <span className="text-sm"><CalendarFold /></span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={message.sender.avatar || "/placeholder.svg"}
                    alt={message.sender.username || "User"}
                  />
                  <AvatarFallback className="text-xs">
                    {message.sender.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[var(--textNeutral)]">
                  {message.sender.username}
                </span>
              </div>
            </div>

            {/* Event content */}
            <div className="text-base text-[var(--textNeutral)] space-y-2">
              {parsedContent.map((part, idx) => {
                if (part.type === "text") {
                  // Check for markdown-style bold text
                  const content = part.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return (
                    <div
                      key={idx}
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  );
                } else if (part.type === "image") {
                  return (
                    <img
                      key={idx}
                      src={part.content}
                      alt="Event image"
                      className="rounded-md max-w-full max-h-40 border border-blue-200"
                    />
                  );
                } else if (part.type === "link") {
                  return (
                    <a
                      key={idx}
                      href={part.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline break-all"
                    >
                      {part.content}
                    </a>
                  );
                }
              })}
            </div>

            {/* Event badge */}
            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium  ">
                Nouvel événement
              </span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400 text-center mt-1">
          {(() => {
            try {
              const date = new Date(message.timestamp);
              return isNaN(date.getTime()) ? "À l'instant" : formatDistanceToNow(date, { addSuffix: true });
            } catch {
              return "À l'instant";
            }
          })()}
        </div>
      </div>
    );
  }

  // Regular message rendering
  return (
    <div className={`flex flex-col gap-1 mb-4 ${isFromCurrentUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex gap-3 ${isFromCurrentUser ? 'flex-row-reverse' : ''}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={message.sender.avatar || "/placeholder.svg"}
            alt={message.sender.username || "User"}
          />
          <AvatarFallback>
            {message.sender.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div
          className={`relative inline-block px-4 py-2 rounded-2xl ${isFromCurrentUser
            ? "bg-[var(--pink20)] text-[var(--white10)] rounded-br-md"
            : "bg-[var(--white)] text-[var(--grey80)] rounded-bl-md"
            }`}
          style={{ maxWidth: "70vw", wordBreak: "break-word" }}
        >
          {/* Contenu du message */}
          <div className="space-y-2">
            {parsedContent.map((part, idx) => {
              if (part.type === "text") {
                return <p key={idx} className="text-sm whitespace-pre-wrap">{part.content}</p>;
              } else if (part.type === "image") {
                return (
                  <img
                    key={idx}
                    src={part.content}
                    alt="GIF"
                    className="rounded-md max-w-full max-h-60 border border-gray-200"
                  />
                );
              } else if (part.type === "link") {
                return (
                  <a
                    key={idx}
                    href={part.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 underline break-all"
                  >
                    {part.content}
                  </a>
                );
              }
            })}
          </div>

          {/* Triangle */}
          <span
            className={`
              absolute
              ${isFromCurrentUser ? "rotate-65 -right-1 bottom" : "-rotate-65 -left-1 bottom"}
              w-0 h-0
              border-l-11 border-l-transparent
              border-r-11 border-r-transparent
              border-t-11
              ${isFromCurrentUser ? "border-t-[var(--pink20)]" : "border-t-[var(--white)]"}
            `}
          />
        </div>
      </div>

      {/* Date and Status */}
      <div
        className={`flex items-center gap-2 text-xs text-gray-400 mt-1 px-11 ${isFromCurrentUser ? 'justify-end' : 'justify-start'
          }`}
      >
        <span>
          {(() => {
            try {
              const date = new Date(message.timestamp);
              return isNaN(date.getTime()) ? 'À l\'instant' : formatDistanceToNow(date, { addSuffix: true });
            } catch {
              return 'À l\'instant';
            }
          })()}
        </span>
        {isFromCurrentUser && message.status && (
          <>
            <MessageStatusIcons status={message.status} />
            {/* Debug: show status in console */}
            {console.log(`Message ${message.id} status: ${message.status}`)}
          </>
        )}
      </div>
    </div>
  );
}