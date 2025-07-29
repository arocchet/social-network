import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all groups where user is a member
    const groups = await db.conversation.findMany({
      where: {
        isGroup: true,
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        },
        messages: {
          orderBy: {
            sentAt: 'desc'
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedGroups = groups.map(group => ({
      id: group.id,
      title: group.title,
      memberCount: group.members.length,
      members: group.members.map(member => member.user),
      lastMessage: group.messages[0] ? {
        message: group.messages[0].message,
        sender: group.messages[0].sender.username,
        timestamp: group.messages[0].sentAt.toISOString()
      } : null,
      createdAt: group.createdAt.toISOString()
    }));

    return NextResponse.json({ groups: formattedGroups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, memberIds = [] } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Filter out duplicates and the creator from memberIds to avoid conflicts
    const uniqueMemberIds = [...new Set(memberIds)].filter((memberId: string) => memberId !== userId);

    // Create the group
    const group = await db.conversation.create({
      data: {
        title: title.trim(),
        isGroup: true,
        ownerId: userId,
        members: {
          create: [
            // Creator is automatically a member
            { userId },
            // Add other members (excluding creator to avoid duplicates)
            ...uniqueMemberIds.map((memberId: string) => ({ userId: memberId }))
          ]
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      group: {
        id: group.id,
        title: group.title,
        memberCount: group.members.length,
        members: group.members.map(member => member.user),
        createdAt: group.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}