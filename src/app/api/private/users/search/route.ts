import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    const searchTerm = query.trim();

    // Search users by username, firstName, or lastName
    const users = await db.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId // Exclude current user
            }
          },
          {
            OR: [
              {
                username: {
                  contains: searchTerm
                }
              },
              {
                firstName: {
                  contains: searchTerm
                }
              },
              {
                lastName: {
                  contains: searchTerm
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true
      },
      take: 10 // Limit results
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}