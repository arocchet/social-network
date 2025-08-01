import { NextRequest, NextResponse } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';
import { db } from '@/lib/db';
import { canSendMessageTo } from '@/lib/db/queries/messages/visibilityFilters';

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user ID from the middleware
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, conversationId, message, type } = await request.json();

    // Check if user can send message based on privacy settings
    // Only apply visibility checks for direct messages, not group messages
    if (type === 'direct' && receiverId) {
      const canSend = await canSendMessageTo(userId, receiverId);
      if (!canSend) {
        return NextResponse.json({
          error: 'Cannot send message to this user. They have a private account and you are not friends.'
        }, { status: 403 });
      }
    }
    // Group messages are not affected by individual user privacy settings
    // since group membership allows communication between all members

    // Save message to database
    const savedMessage = type === 'direct'
      ? await db.message.create({
        data: {
          senderId: userId,
          receiverId,
          message,
          status: 'SENT', // Explicitly set status to SENT
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
      })
      : await db.groupMessage.create({
        data: {
          senderId: userId,
          conversationId,
          message,
          status: 'SENT', // Explicitly set status to SENT
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

    // Store the latest message in Redis for real-time updates
    const messageData = {
      id: savedMessage.id,
      senderId: userId,
      receiverId: type === 'direct' ? receiverId : undefined,
      conversationId: type === 'group' ? conversationId : undefined,
      message,
      timestamp: (savedMessage.datetime || savedMessage.deliveredAt || new Date()).toISOString(),
      type,
      status: savedMessage.status || 'SENT', // Ensure status is included
      deliveredAt: savedMessage.deliveredAt?.toISOString(),
      readAt: savedMessage.readAt?.toISOString(),
      sender: savedMessage.sender,
    };

    // Store in Redis with keys that match the WebSocket listening pattern
    if (type === 'direct') {
      // For direct messages, store with both user combinations
      await redisdb.set(`latest:chat:${userId}:${receiverId}`, messageData, { ex: 60 });
      await redisdb.set(`latest:chat:${receiverId}:${userId}`, messageData, { ex: 60 });
    } else {
      // For group messages
      await redisdb.set(`latest:chat:group:${conversationId}`, messageData, { ex: 60 });
    }

    return NextResponse.json({ success: true, message: messageData });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}