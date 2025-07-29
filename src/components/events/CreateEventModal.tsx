'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin } from "lucide-react";

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

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: Event) => void;
  groupId: string;
  groupTitle: string;
}

export function CreateEventModal({ 
  isOpen, 
  onClose, 
  onEventCreated, 
  groupId, 
  groupTitle 
}: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateEvent = async () => {
    if (!title.trim() || !description.trim() || !date || !time) {
      setError('Tous les champs sont requis');
      return;
    }

    const datetime = new Date(`${date}T${time}`);
    if (datetime <= new Date()) {
      setError('La date et l\'heure doivent être dans le futur');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/private/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          datetime: datetime.toISOString(),
          groupId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();
      onEventCreated(data.event);
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de l\'événement');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setError(null);
    setIsCreating(false);
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get minimum time (current time if date is today)
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const minTime = date === today ? currentTime : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Créer un événement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Groupe :</strong> {groupTitle}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'événement *</Label>
            <Input
              id="title"
              placeholder="Ex: Soirée pizza, Sortie au cinéma..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isCreating}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre événement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isCreating}
                min={today}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Heure *
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isCreating}
                min={minTime}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isCreating}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateEvent}
              disabled={isCreating || !title.trim() || !description.trim() || !date || !time}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isCreating ? 'Création...' : 'Créer l\'événement'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}