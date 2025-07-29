import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const senderId = url.searchParams.get('senderId');
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

    if (!senderId) {
      return NextResponse.json({ error: 'senderId is required' }, { status: 400 });
    }

    const whereClause: any = {
      senderId: senderId,
      receiverId: userId
    };

    if (unreadOnly) {
      whereClause.status = {
        in: ['SENT', 'DELIVERED'] // Not read yet
      };
    }

    const messages = await db.message.findMany({
      where: whereClause,
      select: {
        id: true,
        message: true,
        status: true,
        datetime: true,
        readAt: true
      },
      orderBy: {
        datetime: 'desc'
      }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}