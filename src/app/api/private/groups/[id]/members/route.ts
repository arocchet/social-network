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
    const { memberIds } = await request.json();

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ error: 'Member IDs are required' }, { status: 400 });
    }

    // Check if user is the owner or a member of this group
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true
      },
      include: {
        members: true
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const isMember = group.members.some(member => member.userId === userId);
    const isOwner = group.ownerId === userId;

    if (!isMember && !isOwner) {
      return NextResponse.json({ error: 'Not authorized to add members' }, { status: 403 });
    }

    // Filter out users who are already members and remove duplicates
    const existingMemberIds = group.members.map(member => member.userId);
    const uniqueMemberIds = [...new Set(memberIds)];
    const newMemberIds = uniqueMemberIds.filter((id: string) => !existingMemberIds.includes(id));

    if (newMemberIds.length === 0) {
      return NextResponse.json({ error: 'All users are already members' }, { status: 400 });
    }

    // Add new members
    await db.conversationMember.createMany({
      data: newMemberIds.map((memberId: string) => ({
        conversationId: groupId,
        userId: memberId
      })),
      skipDuplicates: true
    });

    // Get updated group with members
    const updatedGroup = await db.conversation.findUnique({
      where: { id: groupId },
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
        id: updatedGroup!.id,
        title: updatedGroup!.title,
        memberCount: updatedGroup!.members.length,
        members: updatedGroup!.members.map(member => member.user),
        createdAt: updatedGroup!.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding members:', error);
    return NextResponse.json({ error: 'Failed to add members' }, { status: 500 });
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
    const { searchParams } = new URL(request.url);
    const memberIdToRemove = searchParams.get('userId');

    if (!memberIdToRemove) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    // Check if user is the owner of this group or removing themselves
    const group = await db.conversation.findUnique({
      where: {
        id: groupId,
        isGroup: true
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const isOwner = group.ownerId === userId;
    const isRemovingSelf = memberIdToRemove === userId;

    if (!isOwner && !isRemovingSelf) {
      return NextResponse.json({ error: 'Not authorized to remove this member' }, { status: 403 });
    }

    // Remove member
    await db.conversationMember.delete({
      where: {
        userId_conversationId: {
          userId: memberIdToRemove,
          conversationId: groupId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}