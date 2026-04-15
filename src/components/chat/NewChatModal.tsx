"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, MessageCircle } from "lucide-react";

import { useUserSearch } from "@/hooks/use-user-search";
import type { UserSearch } from "@/lib/schemas/user/search";

interface NewChatModalProps {
  onStartChat: (userId: string) => void;
}

export function NewChatModal({ onStartChat }: NewChatModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { users: searchResults, isLoading: isSearching } = useUserSearch(searchQuery, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleStartChat = (userId: string) => {
    onStartChat(userId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-4 text-gray-500">
                Recherche en cours...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user: UserSearch) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bgLevel2)] cursor-pointer"
                    onClick={() => handleStartChat(user.id)}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user?.username || "Anonymous"}
                      />
                      <AvatarFallback>
                        {user.firstName?.[0] || user.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username}
                      </div>
                    </div>
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-4 text-gray-500">
                Aucun utilisateur trouvé
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Tapez pour rechercher des utilisateurs
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
