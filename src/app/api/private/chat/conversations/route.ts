import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Get the authenticated user ID from the middleware
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get recent messages for this user
    const recentMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        datetime: 'desc',
      },
      take: 100,
    });

    // Group messages by conversation partner
    const conversationMap = new Map();
    
    recentMessages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          id: partnerId,
          user: {
            id: partner.id,
            username: partner.username,
            displayName: partner.firstName && partner.lastName 
              ? `${partner.firstName} ${partner.lastName}` 
              : partner.username,
            avatar: partner.avatar,
            isOnline: false, // TODO: implement online status
          },
          lastMessage: {
            text: message.message,
            timestamp: message.datetime,
            isRead: true, // TODO: implement read status
            isFromMe: message.senderId === userId,
          },
          unreadCount: 0, // TODO: implement unread count
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}