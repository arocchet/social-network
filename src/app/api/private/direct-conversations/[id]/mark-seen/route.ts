import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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
    const { id: otherUserId } = await params;

    // Verify that the other user exists
    const otherUser = await db.user.findUnique({
      where: { id: otherUserId }
    });

    if (!otherUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all unread messages from the other user to the current user
    const messagesToUpdate = await db.message.findMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        status: {
          in: ['SENT', 'DELIVERED'] // Only update if not already read
        }
      },
      select: {
        id: true,
        senderId: true
      }
    });

    // Update messages to read status
    await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        status: {
          in: ['SENT', 'DELIVERED']
        }
      },
      data: {
        status: 'READ',
        readAt: new Date(),
        deliveredAt: new Date()
      }
    });

    // Send status updates via Redis for each message
    const now = new Date();
    for (const message of messagesToUpdate) {
      const statusUpdate = {
        type: 'message_status_update',
        messageId: message.id,
        status: 'READ',
        deliveredAt: now.toISOString(),
        readAt: now.toISOString(),
        conversationId: otherUserId, // For direct messages, use other user as conversationId for WebSocket routing
        timestamp: now.toISOString()
      };

      const statusKey = `status_update:${message.senderId}:${message.id}:${Date.now()}`;
      await redisdb.set(statusKey, statusUpdate, { ex: 300 });
      console.log(`Direct message status update sent for message ${message.id} to user ${message.senderId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking direct conversation as seen:', error);
    return NextResponse.json({ error: 'Failed to mark conversation as seen' }, { status: 500 });
  }
}