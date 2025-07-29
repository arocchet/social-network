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
    const { id: conversationId } = await params;

    // Check if user is a member of this conversation
    const member = await db.conversationMember.findFirst({
      where: {
        userId: userId,
        conversationId: conversationId
      }
    });

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this conversation' }, { status: 403 });
    }

    // Get the latest message in this conversation
    const latestMessage = await db.groupMessage.findFirst({
      where: {
        conversationId: conversationId
      },
      orderBy: {
        sentAt: 'desc'
      },
      select: {
        id: true
      }
    });

    // Update the member's last seen message and timestamp
    await db.conversationMember.update({
      where: {
        id: member.id
      },
      data: {
        lastSeenMessageId: latestMessage?.id || null,
        lastSeenAt: new Date()
      }
    });

    // Mark all unread messages in this conversation as READ for this user
    if (latestMessage) {
      // Get all messages that need to be updated to READ
      const messagesToUpdate = await db.groupMessage.findMany({
        where: {
          conversationId: conversationId,
          senderId: {
            not: userId // Don't update own messages
          },
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
      await db.groupMessage.updateMany({
        where: {
          conversationId: conversationId,
          senderId: {
            not: userId
          },
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
          conversationId: conversationId,
          timestamp: now.toISOString()
        };

        const statusKey = `status_update:${message.senderId}:${message.id}:${Date.now()}`;
        await redisdb.set(statusKey, statusUpdate, { ex: 300 });
        console.log(`Status update sent for message ${message.id} to user ${message.senderId}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking conversation as seen:', error);
    return NextResponse.json({ error: 'Failed to mark conversation as seen' }, { status: 500 });
  }
}