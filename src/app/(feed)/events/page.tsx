'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Clock, Users, Filter, ArrowLeft } from 'lucide-react';
import { EventCard } from '@/components/events/EventCard';
import Link from 'next/link';

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'my-events'>('upcoming');

  useEffect(() => {
    loadEvents();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/private/events');
      const data = await response.json();

      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRsvpUpdate = (eventId: string, status: 'YES' | 'NO' | 'MAYBE' | null) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          // Update RSVP counts
          const updatedCounts = { ...event.rsvpCounts };

          // Remove from previous status if there was one
          if (event.userRsvp) {
            const prevStatus = event.userRsvp.toLowerCase() as 'yes' | 'no' | 'maybe';
            updatedCounts[prevStatus] = Math.max(0, updatedCounts[prevStatus] - 1);
          }

          // Add to new status if not null
          if (status) {
            const newStatus = status.toLowerCase() as 'yes' | 'no' | 'maybe';
            updatedCounts[newStatus] = updatedCounts[newStatus] + 1;
          }

          return {
            ...event,
            userRsvp: status,
            rsvpCounts: updatedCounts
          };
        }
        return event;
      })
    );
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/private/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      } else {
        alert('Erreur lors de la suppression de l\'événement');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.datetime) > now);
  const pastEvents = events.filter(event => new Date(event.datetime) <= now);
  const myEvents = events.filter(event => event.owner.id === currentUserId);

  const getEventsForTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      case 'my-events':
        return myEvents;
      default:
        return upcomingEvents;
    }
  };

  const currentEvents = getEventsForTab();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Chargement des événements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className='flex'>
          <Link href={"/"}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Événements
          </h1>

        </div>
        <Link href="/groups">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Voir mes groupes
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes événements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participations</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(event => event.userRsvp === 'YES').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            À venir ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="my-events" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mes événements ({myEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Passés ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement à venir</h3>
                <p className="text-gray-600 mb-6">
                  Créez un événement dans un de vos groupes ou attendez que d'autres membres en organisent.
                </p>
                <Link href="/groups">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Voir mes groupes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  onRsvpUpdate={handleRsvpUpdate}
                  onDelete={event.owner.id === currentUserId ? handleDeleteEvent : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          {myEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement créé</h3>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore créé d'événement. Organisez quelque chose pour vos groupes !
                </p>
                <Link href="/groups">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Créer un événement
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  onRsvpUpdate={handleRsvpUpdate}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement passé</h3>
                <p className="text-gray-600">
                  Les événements terminés apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  onRsvpUpdate={handleRsvpUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}