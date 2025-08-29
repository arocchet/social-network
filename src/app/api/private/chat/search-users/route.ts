import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { canSendMessageTo } from '@/lib/db/queries/messages/visibilityFilters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const userId = request.headers.get('x-user-id');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId // Exclude self from search results
            }
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                },
              },
              {
                firstName: {
                  contains: query,
                },
              },
              {
                lastName: {
                  contains: query,
                },
              },
              {
                email: {
                  contains: query,
                },
              },
            ],
          }
        ]
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        visibility: true,
      },
      take: 20,
    });

    // Filter users based on message visibility - only show users you can message
    const filteredUsers = [];
    for (const user of users) {
      const canMessage = await canSendMessageTo(userId, user.id);
      if (canMessage) {
        // Remove visibility from the response
        const { visibility, ...userWithoutVisibility } = user;
        filteredUsers.push(userWithoutVisibility);
      }
    }

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}