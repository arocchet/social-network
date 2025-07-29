import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateEventMessage } from '@/lib/event-message-utils';
import { redisdb } from '@/lib/server/websocket/redis';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;
    const { status } = await request.json();

    if (!status || !['YES', 'NO', 'MAYBE'].includes(status)) {
      return NextResponse.json({ error: 'Invalid RSVP status. Must be YES, NO, or MAYBE' }, { status: 400 });
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId }
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

    // Upsert RSVP (create or update)
    const rsvp = await db.rsvp.upsert({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId
        }
      },
      update: {
        status: status as 'YES' | 'NO' | 'MAYBE'
      },
      create: {
        userId: userId,
        eventId: eventId,
        status: status as 'YES' | 'NO' | 'MAYBE'
      },
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
    });

    // Update the event message in chat to show current participants
    try {
      // Get the updated event with all RSVPs
      const updatedEvent = await db.event.findUnique({
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
          },
          messages: {
            where: {
              eventId: eventId
            },
            orderBy: {
              sentAt: 'desc'
            },
            take: 1
          }
        }
      });

      if (updatedEvent && updatedEvent.messages.length > 0) {
        const updatedMessage = updateEventMessage({
          id: updatedEvent.id,
          title: updatedEvent.title,
          description: updatedEvent.description,
          datetime: updatedEvent.datetime,
          owner: updatedEvent.owner,
          rsvps: updatedEvent.rsvps.map(rsvp => ({
            status: rsvp.status as 'YES' | 'NO' | 'MAYBE',
            user: rsvp.user
          }))
        });

        // Update the message in the database
        const chatMessage = updatedEvent.messages[0];
        await db.groupMessage.update({
          where: { id: chatMessage.id },
          data: { message: updatedMessage }
        });

        // Update in Redis for real-time sync
        const messageData = {
          id: chatMessage.id,
          senderId: chatMessage.senderId,
          conversationId: chatMessage.conversationId,
          message: updatedMessage,
          timestamp: chatMessage.sentAt.toISOString(),
          type: 'group',
          eventId: eventId,
          sender: {
            id: updatedEvent.owner.id,
            username: updatedEvent.owner.username,
            avatar: updatedEvent.owner.avatar,
          },
        };

        await redisdb.set(
          `latest:chat:group:${chatMessage.conversationId}`,
          messageData,
          { ex: 60 }
        );
      }
    } catch (error) {
      console.error('Error updating event message:', error);
      // Don't fail the RSVP if message update fails
    }

    return NextResponse.json({
      rsvp: {
        id: rsvp.id,
        status: rsvp.status,
        user: rsvp.user,
        createdAt: rsvp.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 });
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

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId }
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

    // Delete RSVP if it exists
    await db.rsvp.deleteMany({
      where: {
        userId: userId,
        eventId: eventId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
  }
}