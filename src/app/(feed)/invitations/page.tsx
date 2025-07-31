'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Check, X, Mail, Clock, ArrowLeft, UserPlus, Tabs } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { SuccessModal } from '@/components/ui/success-modal';
import { useNotifications } from '@/hooks/use-notifications';

interface Invitation {
  id: string;
  groupId: string;
  group: {
    id: string;
    title: string;
  };
  inviter: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

interface FriendRequest {
  id: string;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'friends'>('friends');
  const { refreshCounts } = useNotifications();
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    groupTitle?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    loadInvitations();
    loadFriendRequests();
  }, []);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/private/invitations');
      const data = await response.json();

      if (data.invitations) {
        setInvitations(data.invitations);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch('/api/private/friend-requests');
      const data = await response.json();

      if (data.success && data.friendRequests) {
        setFriendRequests(data.friendRequests);
      }
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const handleRespondToInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
    setRespondingTo(invitationId);
    try {
      const response = await fetch(`/api/private/invitations/${invitationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Find the invitation to get group details
        const invitation = invitations.find(inv => inv.id === invitationId);

        // Remove the invitation from the list since it's no longer pending
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

        // Refresh notification counts
        refreshCounts();

        if (action === 'accept') {
          // Show success modal for accepted invitations
          setSuccessModal({
            isOpen: true,
            title: 'Invitation acceptée !',
            message: `Vous avez rejoint le groupe "${invitation?.group.title}" avec succès !`,
            groupTitle: invitation?.group.title
          });
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la réponse à l\'invitation');
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
      alert('Erreur lors de la réponse à l\'invitation');
    } finally {
      setRespondingTo(null);
    }
  };

  const handleRespondToFriendRequest = async (requestId: string, action: 'ACCEPT' | 'DECLINE') => {
    setRespondingTo(requestId);
    try {
      const response = await fetch(`/api/private/friend-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Find the friend request to get user details
        const friendRequest = friendRequests.find(req => req.id === requestId);

        // Remove the friend request from the list since it's no longer pending
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));

        // Refresh notification counts
        refreshCounts();

        if (action === 'ACCEPT') {
          // Show success modal for accepted friend requests
          const userName = friendRequest?.user.firstName && friendRequest?.user.lastName
            ? `${friendRequest.user.firstName} ${friendRequest.user.lastName}`
            : friendRequest?.user.username;

          setSuccessModal({
            isOpen: true,
            title: 'Demande d\'ami acceptée !',
            message: `Vous êtes maintenant ami(e) avec ${userName} !`,
          });
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la réponse à la demande d\'ami');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      alert('Erreur lors de la réponse à la demande d\'ami');
    } finally {
      setRespondingTo(null);
    }
  };

  const getDisplayName = (user: { firstName?: string; lastName?: string; username: string }) => {
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Chargement des invitations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--bgLevel1)]">
      {/* Header */}
      <div className="mb-8 flex">
        <Link href={"/"}>
          <Button
            variant="ghost"

            className="hover:bg-[var(--bgLevel2)] cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Mail className="w-8 h-8" />
          Invitations
        </h1>

      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-[var(--bgLevel2)] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'friends'
                ? 'bg-[var(--blue)] text-white'
                : 'text-[var(--textMinimal)] hover:bg-[var(--greyHighlighted)]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Demandes d'amis
            {friendRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-red-500 text-white">
                {friendRequests.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'groups'
                ? 'bg-[var(--blue)] text-white'
                : 'text-[var(--textMinimal)] hover:bg-[var(--greyHighlighted)]'
            }`}
          >
            <Users className="w-4 h-4" />
            Invitations groupes
            {invitations.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-red-500 text-white">
                {invitations.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Friend Requests */}
      {activeTab === 'friends' && (
        <>
          {friendRequests.length === 0 ? (
            <Card className="text-center py-12 bg-[var(--bgLevel2)]">
              <CardContent>
                <UserPlus className="w-16 h-16 text-[var(--textNeutral)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande d'ami</h3>
                <p className="text-[var(--black70)]">
                  Vous n'avez pas de demandes d'amis en attente pour le moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <Card key={request.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.user.firstName?.[0] || request.user.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Request Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-lg">
                              Demande d'ami de {getDisplayName(request.user)}
                            </h3>
                            <p className="text-[var(--textMinimal)] mt-1">
                              <strong>{getDisplayName(request.user)}</strong> souhaite vous ajouter en ami
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-[var(--textNeutral)]">
                              <Clock className="w-4 h-4" />
                              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleRespondToFriendRequest(request.id, 'ACCEPT')}
                              disabled={respondingTo === request.id}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRespondToFriendRequest(request.id, 'DECLINE')}
                              disabled={respondingTo === request.id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {respondingTo === request.id && (
                      <div className="mt-4 text-center">
                        <div className="text-sm text-gray-500">
                          Traitement en cours...
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Group Invitations */}
      {activeTab === 'groups' && (
        <>
          {invitations.length === 0 ? (
        <Card className="text-center py-12 bg-[var(--bgLevel2)] ">
          <CardContent>
            <Mail className="w-16 h-16 text-[var(--textNeutral)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune invitation</h3>
            <p className="text-[var(--black70)]">
              Vous n'avez pas d'invitations en attente pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Inviter Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={invitation.inviter.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {invitation.inviter.firstName?.[0] || invitation.inviter.username?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Invitation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg">
                          Invitation au groupe "{invitation.group.title}"
                        </h3>
                        <p className="text-gray-600 mt-1">
                          <strong>{getDisplayName(invitation.inviter)}</strong> vous a invité(e) à rejoindre ce groupe
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-[var(--textNeutral)]">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleRespondToInvitation(invitation.id, 'accept')}
                          disabled={respondingTo === invitation.id}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespondToInvitation(invitation.id, 'decline')}
                          disabled={respondingTo === invitation.id}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    </div>

                    {/* Group Info */}
                    <div className="mt-4 p-3 bg-[var(--bgLevel2)] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 " />
                        <span className="text-sm font-medium ">
                          Groupe: {invitation.group.title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {respondingTo === invitation.id && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-500">
                      Traitement en cours...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </>
      )}

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
}