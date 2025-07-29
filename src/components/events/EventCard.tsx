'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Check, X, HelpCircle, Edit, Trash2 } from 'lucide-react';
// Using native JavaScript date formatting

interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  owner: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  group: {
    id: string;
    title: string;
  };
  rsvpCounts: {
    yes: number;
    no: number;
    maybe: number;
  };
  userRsvp: string | null;
  createdAt: string;
}

interface EventCardProps {
  event: Event;
  currentUserId: string;
  onRsvpUpdate: (eventId: string, status: 'YES' | 'NO' | 'MAYBE' | null) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  currentUserId,
  onRsvpUpdate,
  onEdit,
  onDelete
}: EventCardProps) {
  const [isUpdatingRsvp, setIsUpdatingRsvp] = useState(false);

  const isOwner = event.owner.id === currentUserId;
  const eventDate = new Date(event.datetime);
  const isPastEvent = eventDate < new Date();

  const handleRsvpUpdate = async (status: 'YES' | 'NO' | 'MAYBE' | null) => {
    if (isUpdatingRsvp || isPastEvent) return;

    setIsUpdatingRsvp(true);
    try {
      if (status === null) {
        // Remove RSVP
        const response = await fetch(`/api/private/events/${event.id}/rsvp`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to remove RSVP');
      } else {
        // Add/Update RSVP
        const response = await fetch(`/api/private/events/${event.id}/rsvp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update RSVP');
      }

      onRsvpUpdate(event.id, status);
    } catch (error) {
      console.error('Error updating RSVP:', error);
    } finally {
      setIsUpdatingRsvp(false);
    }
  };

  const getRsvpButtonVariant = (status: 'YES' | 'NO' | 'MAYBE') => {
    if (event.userRsvp === status) {
      return status === 'YES' ? 'default' : status === 'NO' ? 'destructive' : 'secondary';
    }
    return 'outline';
  };

  const getRsvpButtonClass = (status: 'YES' | 'NO' | 'MAYBE') => {
    if (event.userRsvp === status) {
      return status === 'YES'
        ? 'bg-green-500 hover:bg-green-600 text-white'
        : status === 'NO'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-yellow-500 hover:bg-yellow-600 text-white';
    }
    return '';
  };

  const getOwnerDisplayName = () => {
    const { firstName, lastName, username } = event.owner;
    return firstName && lastName ? `${firstName} ${lastName}` : username;
  };

  const formatEventDate = () => {
    return eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventTime = () => {
    return eventDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`transition-shadow hover:shadow-lg ${isPastEvent ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {event.title}
              {isPastEvent && (
                <Badge variant="secondary" className="text-xs">
                  Terminé
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatEventDate()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatEventTime()}
                </div>
              </div>
            </CardDescription>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event)}
                  className="h-8 w-8"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Owner Info */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.owner.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {event.owner.firstName?.[0] || event.owner.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Organisé par <strong>{getOwnerDisplayName()}</strong>
          </span>
        </div>

        {/* RSVP Counts */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{event.rsvpCounts.yes} Oui</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{event.rsvpCounts.maybe} Peut-être</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{event.rsvpCounts.no} Non</span>
          </div>
        </div>

        {/* RSVP Buttons */}
        {!isPastEvent && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={getRsvpButtonVariant('YES')}
              className={getRsvpButtonClass('YES')}
              onClick={() => handleRsvpUpdate(event.userRsvp === 'YES' ? null : 'YES')}
              disabled={isUpdatingRsvp}
            >
              <Check className="w-4 h-4 mr-1" />
              {event.userRsvp === 'YES' ? 'Je participe' : 'Oui'}
            </Button>
            <Button
              size="sm"
              variant={getRsvpButtonVariant('MAYBE')}
              className={getRsvpButtonClass('MAYBE')}
              onClick={() => handleRsvpUpdate(event.userRsvp === 'MAYBE' ? null : 'MAYBE')}
              disabled={isUpdatingRsvp}
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              {event.userRsvp === 'MAYBE' ? 'Peut-être' : 'Peut-être'}
            </Button>
            <Button
              size="sm"
              variant={getRsvpButtonVariant('NO')}
              className={getRsvpButtonClass('NO')}
              onClick={() => handleRsvpUpdate(event.userRsvp === 'NO' ? null : 'NO')}
              disabled={isUpdatingRsvp}
            >
              <X className="w-4 h-4 mr-1" />
              {event.userRsvp === 'NO' ? 'Non présent' : 'Non'}
            </Button>
          </div>
        )}

        {/* Group Badge */}
        <div className="mt-4 pt-3 border-t">
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {event.group.title}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}