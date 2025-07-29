import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
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
    const membership = await db.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: userId
      }
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    // Check if user is the owner
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.ownerId === userId) {
      return NextResponse.json({ 
        error: 'Group owner cannot leave the group. Please delete the group or transfer ownership first.' 
      }, { status: 400 });
    }

    // Remove user from group in transaction
    await db.$transaction(async (tx) => {
      // Remove from conversation members
      await tx.conversationMember.delete({
        where: {
          id: membership.id
        }
      });

      // Remove from group members table if exists
      await tx.groupMember.deleteMany({
        where: {
          groupId: groupId,
          userId: userId
        }
      });

      // Delete any pending invitations for this user to this group
      await tx.groupInvitation.deleteMany({
        where: {
          groupId: groupId,
          invitedId: userId
        }
      });

      // Delete any pending join requests from this user to this group
      await tx.groupJoinRequest.deleteMany({
        where: {
          groupId: groupId,
          seeker: userId
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Successfully left the group' });
  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 });
  }
}