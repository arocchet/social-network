import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const receiverId = searchParams.get('receiverId');
  const conversationId = searchParams.get('conversationId');
  const type = searchParams.get('type') || 'direct';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    if (type === 'direct' && userId && receiverId) {
      // Get direct messages between two users
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          datetime: 'desc',
        },
        take: limit,
        skip: offset,
      });

      // Transform messages to include timestamp and status in the expected format
      const formattedMessages = messages.reverse().map(msg => ({
        ...msg,
        timestamp: msg.datetime.toISOString(),
        // Include message status information
        status: msg.status,
        deliveredAt: msg.deliveredAt?.toISOString(),
        readAt: msg.readAt?.toISOString(),
      }));

      return NextResponse.json({ messages: formattedMessages });
    } else if (type === 'group' && conversationId) {
      // Get group messages
      const messages = await db.groupMessage.findMany({
        where: {
          conversationId: conversationId,
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
        orderBy: {
          sentAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      // Transform messages to include timestamp and status in the expected format
      const formattedGroupMessages = messages.reverse().map(msg => ({
        ...msg,
        timestamp: msg.sentAt.toISOString(),
        // Use the actual eventId from the database
        eventId: msg.eventId,
        // Include message status information
        status: msg.status,
        deliveredAt: msg.deliveredAt?.toISOString(),
        readAt: msg.readAt?.toISOString(),
      }));

      return NextResponse.json({ messages: formattedGroupMessages });
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}