import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: invitationId } = await params;
    const { action } = await request.json();

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "accept" or "decline"' }, { status: 400 });
    }

    // Find the invitation
    const invitation = await db.groupInvitation.findUnique({
      where: { id: invitationId },
      include: {
        Conversation: true
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if the invitation is for the current user
    if (invitation.invitedId !== userId) {
      return NextResponse.json({ error: 'Not authorized to respond to this invitation' }, { status: 403 });
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invitation has already been responded to' }, { status: 400 });
    }

    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

    // Update the invitation status
    const updatedInvitation = await db.groupInvitation.update({
      where: { id: invitationId },
      data: { status: newStatus },
      include: {
        Conversation: {
          select: {
            id: true,
            title: true
          }
        },
        User_GroupInvitation_inviterIdToUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    // If accepted, add user to the group
    if (action === 'accept') {
      await db.conversationMember.create({
        data: {
          userId: userId,
          conversationId: invitation.groupId
        }
      });
    }

    return NextResponse.json({
      invitation: {
        id: updatedInvitation.id,
        groupId: updatedInvitation.groupId,
        group: updatedInvitation.Conversation,
        inviter: updatedInvitation.User_GroupInvitation_inviterIdToUser,
        status: updatedInvitation.status,
        createdAt: updatedInvitation.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json({ error: 'Failed to respond to invitation' }, { status: 500 });
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
    const { id: invitationId } = await params;

    // Find the invitation
    const invitation = await db.groupInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if user can delete this invitation (either inviter or invited)
    if (invitation.inviterId !== userId && invitation.invitedId !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this invitation' }, { status: 403 });
    }

    // Delete the invitation
    await db.groupInvitation.delete({
      where: { id: invitationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 });
  }
}