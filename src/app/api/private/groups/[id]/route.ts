import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: groupId } = await params;

    // Check if user is a member of this group
    const isMember = await db.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: userId
      }
    });

    if (!isMember) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    // Get group details
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true
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
        User: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        }
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({
      group: {
        id: group.id,
        title: group.title,
        owner: group.User,
        memberCount: group.members.length,
        members: group.members.map(member => member.user),
        createdAt: group.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: groupId } = await params;
    const { title } = await request.json();

    // Check if user is the owner of this group
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true,
        ownerId: userId
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found or unauthorized' }, { status: 404 });
    }

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Update group
    const updatedGroup = await db.conversation.update({
      where: { id: groupId },
      data: { title: title.trim() },
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
        id: updatedGroup.id,
        title: updatedGroup.title,
        memberCount: updatedGroup.members.length,
        members: updatedGroup.members.map(member => member.user),
        createdAt: updatedGroup.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: groupId } = await params;

    // Check if user is the owner of this group
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true,
        ownerId: userId
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found or unauthorized' }, { status: 404 });
    }

    // Delete all related data in transaction
    await db.$transaction(async (tx) => {
      // Delete all RSVPs for events in this group
      await tx.rsvp.deleteMany({
        where: {
          event: {
            groupId: groupId
          }
        }
      });

      // Delete all group messages
      await tx.groupMessage.deleteMany({
        where: {
          conversationId: groupId
        }
      });

      // Delete all events in this group
      await tx.event.deleteMany({
        where: {
          groupId: groupId
        }
      });

      // Delete all group invitations
      await tx.groupInvitation.deleteMany({
        where: {
          groupId: groupId
        }
      });

      // Delete all join requests
      await tx.groupJoinRequest.deleteMany({
        where: {
          groupId: groupId
        }
      });

      // Delete all group members
      await tx.groupMember.deleteMany({
        where: {
          groupId: groupId
        }
      });

      // Delete all conversation members
      await tx.conversationMember.deleteMany({
        where: {
          conversationId: groupId
        }
      });

      // Finally delete the group
      await tx.conversation.delete({
        where: {
          id: groupId
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}