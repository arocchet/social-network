import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redisdb } from '@/lib/server/websocket/redis';
import { generateEventMessage } from '@/lib/event-message-utils';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    let whereClause;

    if (groupId) {
      // Get events for a specific group
      // First check if user is a member of this group
      const isMember = await db.conversationMember.findFirst({
        where: {
          conversationId: groupId,
          userId: userId
        }
      });

      if (!isMember) {
        return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
      }

      whereClause = { groupId };
    } else {
      // Get all events for groups the user is a member of
      whereClause = {
        group: {
          members: {
            some: {
              userId: userId
            }
          }
        }
      };
    }

    const events = await db.event.findMany({
      where: whereClause,
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
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      datetime: event.datetime.toISOString(),
      owner: event.owner,
      group: event.group,
      rsvpCounts: {
        yes: event.rsvps.filter(rsvp => rsvp.status === 'YES').length,
        no: event.rsvps.filter(rsvp => rsvp.status === 'NO').length,
        maybe: event.rsvps.filter(rsvp => rsvp.status === 'MAYBE').length,
      },
      userRsvp: event.rsvps.find(rsvp => rsvp.userId === userId)?.status || null,
      createdAt: event.createdAt.toISOString()
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, datetime, groupId } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!datetime) {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // Verify user is a member of the group
    const isMember = await db.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: userId
      }
    });

    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    // Verify the datetime is in the future
    const eventDate = new Date(datetime);
    if (eventDate <= new Date()) {
      return NextResponse.json({ error: 'Event date must be in the future' }, { status: 400 });
    }

    // Create the event
    const event = await db.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        datetime: eventDate,
        groupId,
        ownerId: userId,
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
        }
      }
    });

    // Send a message to the group chat about the new event
    const eventMessage = generateEventMessage({
      id: event.id,
      title: event.title,
      description: event.description,
      datetime: event.datetime,
      owner: event.owner,
      rsvps: [] // No RSVPs yet for a new event
    });

    // Save the message to the database
    const chatMessage = await db.groupMessage.create({
      data: {
        senderId: userId,
        conversationId: groupId,
        message: eventMessage,
        eventId: event.id, // Link the message to the event
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Store in Redis for real-time updates
    const messageData = {
      id: chatMessage.id,
      senderId: userId,
      conversationId: groupId,
      message: eventMessage,
      timestamp: chatMessage.sentAt.toISOString(),
      type: 'group',
      sender: chatMessage.sender,
      eventId: event.id, // Add event ID to identify this as an event message
    };

    await redisdb.set(
      `latest:chat:group:${groupId}`,
      messageData,
      { ex: 60 }
    );

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        datetime: event.datetime.toISOString(),
        owner: event.owner,
        group: event.group,
        rsvpCounts: {
          yes: 0,
          no: 0,
          maybe: 0,
        },
        userRsvp: null,
        createdAt: event.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}