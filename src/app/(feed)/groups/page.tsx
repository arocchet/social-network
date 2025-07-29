'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Plus, Settings, ArrowLeft } from 'lucide-react';
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
        <div className='flex gap-2'>
          <Link href={"/"}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>

          <h1 className="text-3xl font-bold">Mes Groupes</h1>

        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer un groupe
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="text-center py-12 bg-[var(--bgLevel2)]">
          <CardContent>
            <Users className="w-16 h-16 text-[var(--textNeutral)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun groupe pour le moment</h3>
            <p className="text-[var(--textNeutral)] mb-6">
              Créez votre premier groupe pour commencer à échanger avec plusieurs personnes à la fois.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[var(--blue40)] hover:bg-[var(--blue60)] "
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer mon premier groupe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className=" bg-[var(--bgLevel2)]">
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
                      <Avatar key={member.id} className="w-8 h-8 border-2 ">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.firstName?.[0] || member.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="w-8 h-8 rounded-full  border-[var(--detailMinimal)]  border-2 flex items-center justify-center">
                        <span className="text-xs text-[var(--textNeutral)]">+{group.memberCount - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-[var(--textNeutral)]">
                    {group.members.slice(0, 2).map(m =>
                      m.firstName ? `${m.firstName} ${m.lastName || ''}`.trim() : m.username
                    ).join(', ')}
                    {group.memberCount > 2 && ` et ${group.memberCount - 2} autre${group.memberCount > 3 ? 's' : ''}`}
                  </span>
                </div>

                {/* Last Message */}


                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/groups/${group.id}`} className="flex-1">
                    <Button className="w-full bg-[var(--blue40)] hover:bg-[var(--blue60)] text-white">
                      <Settings className="w-4 h-4 " />
                      Gérer le groupe
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