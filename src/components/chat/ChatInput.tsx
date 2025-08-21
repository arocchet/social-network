'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { FaRegFaceSmileBeam } from 'react-icons/fa6';
import {
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPicker,
} from '../reaction/emojiPicker';
import { GifPopover } from '@/app/utils/giphy';

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isConnected: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function ChatInput({ onSendMessage, isConnected, onTyping, onStopTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiOpen(false);
  };

  const handleGifSelect = (gif: { url: string }) => {
    // Pour l'instant, on ajoute juste l'URL du GIF au commentaire
    // Vous pourriez vouloir implémenter un système de média plus sophistiqué
    setMessage(prev => prev + ` ${gif.url}`);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || !isConnected) return;

    setIsSending(true);
    try {
      // Stop typing when sending message
      if (onStopTyping) {
        onStopTyping();
      }
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="border-t border-[var(--detailMinimal)] p-4 bg-[var(--bgLevel1)]">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Input + emoji */}
          <div className=" flex-1 items-center">
            <Input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // Trigger typing indicator when user types
                if (onTyping && e.target.value.length > 0) {
                  onTyping();
                }
              }}
              placeholder={isConnected ? "Tapez votre message..." : "Connexion en cours..."}
              disabled={isSending || !isConnected}
              className="w-full pr-10"
            />


          </div>

          {/* Bouton envoyer */}
          <Button
            type="submit"
            disabled={!message.trim() || isSending || !isConnected}
            size="icon"
            className="mt-2 sm:mt-0"
          >
            <Send className="w-4 h-4" />
          </Button>
          <div className='flex items-center gap-2'><GifPopover
            apiKey={GIPHY_API_KEY!}
            onSelect={handleGifSelect}
          />
            <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className=" text-gray-400 hover:text-gray-600"
                >
                  <FaRegFaceSmileBeam className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0 z-[100]">
                <EmojiPicker
                  className="h-[342px]"
                  onEmojiSelect={({ emoji }) => handleEmojiSelect(emoji)}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover></div>
        </div>
      </div>
    </form>
  );
}
