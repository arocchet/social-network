interface EventOwner {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface EventParticipant {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface EventRsvp {
  status: 'YES' | 'NO' | 'MAYBE';
  user: EventParticipant;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  owner: EventOwner;
  rsvps: EventRsvp[];
}

export function generateEventMessage(event: EventDetails): string {
  const eventDateTime = new Date(event.datetime);
  const formattedDate = eventDateTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDateTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const ownerName = event.owner.firstName && event.owner.lastName
    ? `${event.owner.firstName} ${event.owner.lastName}`
    : event.owner.username;

  // Group participants by RSVP status
  const participants = {
    yes: event.rsvps.filter(rsvp => rsvp.status === 'YES'),
    maybe: event.rsvps.filter(rsvp => rsvp.status === 'MAYBE'),
    no: event.rsvps.filter(rsvp => rsvp.status === 'NO')
  };

  let participantsSection = '';

  if (participants.yes.length > 0) {
    const names = participants.yes.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n✅ **Participants (${participants.yes.length}):**\n${names.join(', ')}`;
  }

  if (participants.maybe.length > 0) {
    const names = participants.maybe.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n\n❓ **Peut-être (${participants.maybe.length}):**\n${names.join(', ')}`;
  }

  if (participants.no.length > 0) {
    const names = participants.no.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n\n❌ **Ne participent pas (${participants.no.length}):**\n${names.join(', ')}`;
  }

  const eventMessage = `**Nouvel événement créé !**

**${event.title}**
${event.description}

${formattedDate}
${formattedTime}

**Organisé par ${ownerName}${participantsSection}**

Répondez à cet événement dans la section Événements !`;

  return eventMessage;
}

export function updateEventMessage(event: EventDetails): string {
  const eventDateTime = new Date(event.datetime);
  const formattedDate = eventDateTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDateTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const ownerName = event.owner.firstName && event.owner.lastName
    ? `${event.owner.firstName} ${event.owner.lastName}`
    : event.owner.username;

  // Group participants by RSVP status
  const participants = {
    yes: event.rsvps.filter(rsvp => rsvp.status === 'YES'),
    maybe: event.rsvps.filter(rsvp => rsvp.status === 'MAYBE'),
    no: event.rsvps.filter(rsvp => rsvp.status === 'NO')
  };

  let participantsSection = '';

  if (participants.yes.length > 0) {
    const names = participants.yes.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n✅ **Participants (${participants.yes.length}):**\n${names.join(', ')}`;
  }

  if (participants.maybe.length > 0) {
    const names = participants.maybe.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n\n❓ **Peut-être (${participants.maybe.length}):**\n${names.join(', ')}`;
  }

  if (participants.no.length > 0) {
    const names = participants.no.map(rsvp =>
      rsvp.user.firstName && rsvp.user.lastName
        ? `${rsvp.user.firstName} ${rsvp.user.lastName}`
        : rsvp.user.username
    );
    participantsSection += `\n\n❌ **Ne peuvent pas venir (${participants.no.length}):**\n${names.join(', ')}`;
  }

  const totalParticipants = participants.yes.length + participants.maybe.length + participants.no.length;
  const responseRate = totalParticipants > 0 ? `\n\n📊 **${totalParticipants} réponse${totalParticipants > 1 ? 's' : ''}**` : '';

  const eventMessage = `**Événement**

**${event.title}**
${event.description}

${formattedDate}
${formattedTime}

Organisé par ${ownerName}${participantsSection}${responseRate}

Répondez à cet événement dans la section Événements !`;

  return eventMessage;
}