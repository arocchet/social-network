'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface Group {
  id: string;
  title: string;
  memberCount: number;
  members: User[];
  createdAt: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: Group) => void;
}

export function CreateGroupModal({ isOpen, onClose, onGroupCreated }: CreateGroupModalProps) {
  const [step, setStep] = useState<'name' | 'members'>('name');
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/private/chat/search-users?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const addMember = (user: User) => {
    if (!selectedMembers.find(m => m.id === user.id)) {
      setSelectedMembers(prev => [...prev, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (userId: string) => {
    setSelectedMembers(prev => prev.filter(m => m.id !== userId));
  };

  const handleNext = () => {
    if (step === 'name' && groupName.trim()) {
      setStep('members');
    }
  };

  const handleBack = () => {
    if (step === 'members') {
      setStep('name');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/private/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: groupName.trim(),
          memberIds: selectedMembers.map(m => m.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.json();
      onGroupCreated(data.group);
      handleClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep('name');
    setGroupName('');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMembers([]);
    setIsCreating(false);
    onClose();
  };

  const getUserDisplayName = (user: User) => {
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[var(--bgLevel1)] ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Créer un nouveau groupe
          </DialogTitle>
        </DialogHeader>

        {step === 'name' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Nom du groupe</Label>
              <Input
                className='bg-[var(--bgLevel2)] '
                id="groupName"
                placeholder="Entrez le nom du groupe..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={handleNext}
                disabled={!groupName.trim()}
                className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {step === 'members' && (
          <div className="space-y-4">
            <div>
              <Label>Nom du groupe</Label>
              <div className="text-sm  rounded-lg p-2 mt-1">
                {groupName}
              </div>
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Membres sélectionnés ({selectedMembers.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1"
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.firstName?.[0] || member.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {getUserDisplayName(member)}
                      </span>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Users */}
            <div className="space-y-2">
              <Label>Ajouter des membres</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des utilisateurs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-48 overflow-y-auto">
              {isSearching ? (
                <div className="text-center py-4 text-gray-500">
                  Recherche en cours...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults
                    .filter(user => !selectedMembers.find(m => m.id === user.id))
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bgLevel2)]  cursor-pointer"
                        onClick={() => addMember(user)}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {user.firstName?.[0] || user.username?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {getUserDisplayName(user)}
                          </div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                </div>
              ) : searchQuery && !isSearching ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Recherchez des utilisateurs à ajouter au groupe
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={isCreating}
                  className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white"
                >
                  {isCreating ? 'Création...' : 'Créer le groupe'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}