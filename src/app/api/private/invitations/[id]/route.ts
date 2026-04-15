import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  try {
    const { id: invitationId } = await params;
    const { action } = await request.json();

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(respondError('Invalid action. Must be "accept" or "decline"'), { status: 400 });
    }

    // Find the invitation
    const invitation = await db.groupInvitation.findUnique({
      where: { id: invitationId },
      include: {
        Conversation: true
      }
    });

    if (!invitation) {
      return NextResponse.json(respondError('Invitation not found'), { status: 404 });
    }

    // Check if the invitation is for the current user
    if (invitation.invitedId !== userId) {
      return NextResponse.json(respondError('Not authorized to respond to this invitation'), { status: 403 });
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(respondError('Invitation has already been responded to'), { status: 400 });
    }

    if (action === 'accept') {
      // Update status to ACCEPTED and add user to the group
      const updatedInvitation = await db.groupInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' },
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

      await db.conversationMember.upsert({
        where: {
          userId_conversationId: {
            userId,
            conversationId: invitation.groupId,
          },
        },
        update: {},
        create: {
          userId,
          conversationId: invitation.groupId,
        },
      });

      // Allégé la DB: supprimer l'invitation après acceptation
      await db.groupInvitation.delete({ where: { id: invitationId } });

      return NextResponse.json(
        respondSuccess(
          {
            id: updatedInvitation.id,
            groupId: updatedInvitation.groupId,
            group: updatedInvitation.Conversation,
            inviter: updatedInvitation.User_GroupInvitation_inviterIdToUser,
            status: updatedInvitation.status,
            createdAt: updatedInvitation.createdAt.toISOString(),
          },
          'Invitation accepted'
        )
      );
    } else {
      // Decline: simply delete the invitation (no DECLINED state in DB)
      await db.groupInvitation.delete({ where: { id: invitationId } });
      return NextResponse.json(respondSuccess(null, 'Invitation declined'));
    }
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json(respondError('Failed to respond to invitation'), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(respondError('Unauthorized'), { status: 401 });
  }

  try {
    const { id: invitationId } = await params;

    // Find the invitation
    const invitation = await db.groupInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return NextResponse.json(respondError('Invitation not found'), { status: 404 });
    }

    // Check if user can delete this invitation (either inviter or invited)
    if (invitation.inviterId !== userId && invitation.invitedId !== userId) {
      return NextResponse.json(respondError('Not authorized to delete this invitation'), { status: 403 });
    }

    // Delete the invitation
    await db.groupInvitation.delete({
      where: { id: invitationId }
    });

    return NextResponse.json(respondSuccess(null, 'Invitation deleted'));
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(respondError('Failed to delete invitation'), { status: 500 });
  }
}
