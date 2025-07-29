import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        },
        group: {
          select: {
            id: true,
            title: true,
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user is a member of the group
    const isMember = await db.conversationMember.findFirst({
      where: {
        conversationId: event.groupId,
        userId: userId
      }
    });

    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      datetime: event.datetime.toISOString(),
      owner: event.owner,
      group: event.group,
      rsvps: {
        yes: event.rsvps.filter(rsvp => rsvp.status === 'YES'),
        no: event.rsvps.filter(rsvp => rsvp.status === 'NO'),
        maybe: event.rsvps.filter(rsvp => rsvp.status === 'MAYBE'),
      },
      rsvpCounts: {
        yes: event.rsvps.filter(rsvp => rsvp.status === 'YES').length,
        no: event.rsvps.filter(rsvp => rsvp.status === 'NO').length,
        maybe: event.rsvps.filter(rsvp => rsvp.status === 'MAYBE').length,
      },
      userRsvp: event.rsvps.find(rsvp => rsvp.userId === userId)?.status || null,
      createdAt: event.createdAt.toISOString()
    };

    return NextResponse.json({ event: formattedEvent });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;
    const { title, description, datetime } = await request.json();

    // Check if event exists and user is the owner
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        owner: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.ownerId !== userId) {
      return NextResponse.json({ error: 'Only the event owner can update this event' }, { status: 403 });
    }

    // Validation
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    if (description !== undefined && !description?.trim()) {
      return NextResponse.json({ error: 'Description cannot be empty' }, { status: 400 });
    }

    if (datetime !== undefined) {
      const eventDate = new Date(datetime);
      if (eventDate <= new Date()) {
        return NextResponse.json({ error: 'Event date must be in the future' }, { status: 400 });
      }
    }

    // Update the event
    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(datetime !== undefined && { datetime: new Date(datetime) }),
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        },
        group: {
          select: {
            id: true,
            title: true,
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      event: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        datetime: updatedEvent.datetime.toISOString(),
        owner: updatedEvent.owner,
        group: updatedEvent.group,
        rsvpCounts: {
          yes: updatedEvent.rsvps.filter(rsvp => rsvp.status === 'YES').length,
          no: updatedEvent.rsvps.filter(rsvp => rsvp.status === 'NO').length,
          maybe: updatedEvent.rsvps.filter(rsvp => rsvp.status === 'MAYBE').length,
        },
        userRsvp: updatedEvent.rsvps.find(rsvp => rsvp.userId === userId)?.status || null,
        createdAt: updatedEvent.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;

    // Check if event exists and user is the owner
    const event = await db.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.ownerId !== userId) {
      return NextResponse.json({ error: 'Only the event owner can delete this event' }, { status: 403 });
    }

    // Delete RSVPs first, then the event
    await db.rsvp.deleteMany({
      where: { eventId: eventId }
    });

    // Now delete the event
    await db.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}