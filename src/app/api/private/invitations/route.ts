import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all pending invitations for the current user
    const invitations = await db.groupInvitation.findMany({
      where: {
        invitedId: userId,
        status: 'PENDING'
      },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      invitations: invitations.map(invitation => ({
        id: invitation.id,
        groupId: invitation.groupId,
        group: invitation.Conversation,
        inviter: invitation.User_GroupInvitation_inviterIdToUser,
        status: invitation.status,
        createdAt: invitation.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}