'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Plus, Settings } from 'lucide-react';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import Link from 'next/link';

interface Group {
  id: string;
  title: string;
  memberCount: number;
  members: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }[];
  lastMessage?: {
    message: string;
    sender: string;
    timestamp: string;
  };
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/private/groups');
      const data = await response.json();
      
      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
    setIsCreateModalOpen(false);
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Chargement des groupes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Groupes</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos conversations de groupe et créez-en de nouvelles
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer un groupe
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun groupe pour le moment</h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier groupe pour commencer à échanger avec plusieurs personnes à la fois.
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer mon premier groupe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {group.memberCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Members Preview */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.firstName?.[0] || member.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{group.memberCount - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {group.members.slice(0, 2).map(m => 
                      m.firstName ? `${m.firstName} ${m.lastName || ''}`.trim() : m.username
                    ).join(', ')}
                    {group.memberCount > 2 && ` et ${group.memberCount - 2} autre${group.memberCount > 3 ? 's' : ''}`}
                  </span>
                </div>

                {/* Last Message */}
                {group.lastMessage && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medio text-gray-700">
                        {group.lastMessage.sender}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(group.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {group.lastMessage.message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/groups/${group.id}`} className="flex-1">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Voir le groupe
                    </Button>
                  </Link>
                  <Link href={`/groups/${group.id}/settings`}>
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
}