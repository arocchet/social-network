import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all groups where user is a member
    const userGroups = await db.conversationMember.findMany({
      where: {
        userId: userId
      },
      select: {
        conversationId: true
      }
    });

    const groupIds = userGroups.map(group => group.conversationId);

    if (groupIds.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    // Count upcoming events in the next 7 days
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingEventsCount = await db.event.count({
      where: {
        groupId: {
          in: groupIds
        },
        datetime: {
          gte: now,
          lte: nextWeek
        }
      }
    });

    return NextResponse.json({ count: upcomingEventsCount });
  } catch (error) {
    console.error('Error counting upcoming events:', error);
    return NextResponse.json({ error: 'Failed to count upcoming events' }, { status: 500 });
  }
}