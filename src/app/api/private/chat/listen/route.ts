import { NextRequest } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';

interface MessageData {
  id: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = request.headers.get('x-user-id');

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  const type = searchParams.get('type') || 'direct';

  // Create Server-Sent Events stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      // For Upstash Redis, we'll use polling instead of pub/sub for real-time updates
      // This is a simplified approach - for production, consider using WebSocket connections

      let isActive = true;
      let lastMessageId = '';

      const pollForMessages = async () => {
        while (isActive) {
          try {
            // Check Redis for new messages
            const channels = type === 'direct'
              ? [`latest:chat:${userId}:${conversationId}`, `latest:chat:${conversationId}:${userId}`]
              : [`latest:chat:group:${conversationId}`];

            for (const channel of channels) {
              const messageData = await redisdb.get(channel);
              if (messageData && typeof messageData === 'object' && 'id' in messageData) {
                const typedMessageData = messageData as MessageData;
                // Check if this is a new message
                if (typedMessageData.id !== lastMessageId) {
                  lastMessageId = typedMessageData.id;

                  // Send the message to the client
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(messageData)}\n\n`)
                  );
                }
              }
            }

            // Check for status updates for this user
            const statusUpdateKeys = await redisdb.keys(`status_update:${userId}:*`);
            for (const key of statusUpdateKeys) {
              const statusUpdate = await redisdb.get(key);
              if (statusUpdate && typeof statusUpdate === 'object') {
                console.log(`Sending status update to user ${userId}:`, statusUpdate);

                // Send status update to client
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(statusUpdate)}\n\n`)
                );

                // Remove the status update after sending
                await redisdb.del(key);
              }
            }
          } catch (error) {
            console.error('Error polling for messages:', error);
          }

          // Wait 500ms before polling again for faster updates
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      };

      // Start polling
      pollForMessages();

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        isActive = false;
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}