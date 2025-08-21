import { NextRequest } from 'next/server';
import { redisdb } from '@/lib/server/websocket/redis';

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

      const channelId = type === 'direct'
        ? `typing_direct_${[userId, conversationId].sort().join('_')}`
        : `typing_group_${conversationId}`;

      // Poll for typing status updates
      const interval = setInterval(async () => {
        try {
          // Get all typing statuses for this conversation
          const typingKeys = await redisdb.keys(`typing:${channelId}:*`);
          
          for (const key of typingKeys) {
            const typingData = await redisdb.get(key);
            if (typingData) {
              const parsedData = typeof typingData === 'string' 
                ? JSON.parse(typingData) 
                : typingData;
              
              // Don't send user's own typing status back to them
              if (parsedData.userId !== userId) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(parsedData)}\n\n`)
                );
              }
            }
          }
        } catch (error) {
          console.error('Error polling typing status:', error);
        }
      }, 1000); // Poll every second

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
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
