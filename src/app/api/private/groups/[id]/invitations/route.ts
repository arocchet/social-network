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
    const { invitedUserId } = await request.json();

    if (!invitedUserId) {
      return NextResponse.json({ error: 'invitedUserId is required' }, { status: 400 });
    }

    // Check if group exists
    const group = await db.conversation.findUnique({
      where: { id: groupId, isGroup: true }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if user is the owner of the group
    if (group.ownerId !== userId) {
      return NextResponse.json({ error: 'Only group owner can send invitations' }, { status: 403 });
    }

    // Check if invited user exists
    const invitedUser = await db.user.findUnique({
      where: { id: invitedUserId }
    });

    if (!invitedUser) {
      return NextResponse.json({ error: 'Invited user not found' }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await db.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: invitedUserId
      }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this group' }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvitation = await db.groupInvitation.findFirst({
      where: {
        groupId: groupId,
        invitedId: invitedUserId,
        status: 'PENDING'
      }
    });

    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this user' }, { status: 400 });
    }

    // Create the invitation
    const invitation = await db.groupInvitation.create({
      data: {
        groupId: groupId,
        inviterId: userId,
        invitedId: invitedUserId,
        status: 'PENDING'
      },
      include: {
        Conversation: {
          select: {
            id: true,
            title: true
          }
        },
        User_GroupInvitation_invitedIdToUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
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

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        groupId: invitation.groupId,
        group: invitation.Conversation,
        inviter: invitation.User_GroupInvitation_inviterIdToUser,
        invited: invitation.User_GroupInvitation_invitedIdToUser,
        status: invitation.status,
        createdAt: invitation.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating group invitation:', error);
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
  }
}

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

    // Check if group exists
    const group = await db.conversation.findUnique({
      where: { id: groupId, isGroup: true }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Check if user is the owner of the group
    if (group.ownerId !== userId) {
      return NextResponse.json({ error: 'Only group owner can view invitations' }, { status: 403 });
    }

    // Get all pending invitations for this group
    const invitations = await db.groupInvitation.findMany({
      where: {
        groupId: groupId,
        status: 'PENDING'
      },
      include: {
        User_GroupInvitation_invitedIdToUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      invitations: invitations.map(invitation => ({
        id: invitation.id,
        invited: invitation.User_GroupInvitation_invitedIdToUser,
        status: invitation.status,
        createdAt: invitation.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching group invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}