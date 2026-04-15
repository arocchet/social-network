import { NextRequest, NextResponse } from "next/server";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { db } from "@/lib/db";
import { countFollow } from "@/lib/db/friendship/countFollow";
import { ProfileVisibility, InvitationStatus } from "@prisma/client";
import { parseOrThrow } from "@/lib/utils/validation";
import { ProfileSummarySchema } from "@/lib/schemas/profile/summary";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { UserPublic, UserSchemas } from "@/lib/schemas/user";

export async function GET(req: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
  try {
    const { userId: targetUserId } = await ctx.params;
    if (!targetUserId) {
      return NextResponse.json(respondError("Target user ID is required"), { status: 400 });
    }

    const currentUserId = await getUserIdFromRequest(req);

    // Fetch target user with public schema (typed and serialized)
    const user = await getUserByIdServer<UserPublic>(targetUserId, UserSchemas.Public);
    if (!user) {
      return NextResponse.json(respondError("User not found"), { status: 404 });
    }

    const isOwnProfile = currentUserId === user.id;

    // Friendship status (pending/accepted/null) — check both directions
    let friendshipStatus: InvitationStatus | null = null;
    if (currentUserId) {
      const friendship = await db.friendship.findFirst({
        where: {
          OR: [
            { userId: currentUserId, friendId: user.id },
            { userId: user.id, friendId: currentUserId },
          ],
        },
        select: { status: true },
      });
      friendshipStatus = friendship?.status ?? null;
    }

    // Follow status: accepted if current -> target accepted exists
    let followStatus: InvitationStatus | null = null;
    if (currentUserId) {
      const followRel = await db.friendship.findFirst({
        where: { userId: currentUserId, friendId: user.id, status: InvitationStatus.ACCEPTED },
        select: { status: true },
      });
      followStatus = followRel?.status ?? null;
    }

    // Stats
    const stats = await countFollow({ userId: user.id });

    // Permissions: can view posts?
    const canViewPosts =
      user.visibility === ProfileVisibility.PUBLIC ||
      isOwnProfile ||
      friendshipStatus === InvitationStatus.ACCEPTED;

    const payload = {
      user,
      relationship: {
        followStatus,
        friendshipStatus,
      },
      stats,
      permissions: { canViewPosts },
      isOwnProfile,
    };
    parseOrThrow(ProfileSummarySchema, payload, { label: 'ProfileSummaryPayload' })
    return NextResponse.json(respondSuccess(payload), { status: 200 });
  } catch (error) {
    console.error("Error in profile summary:", error);
    return NextResponse.json(respondError("Internal server error"), { status: 500 });
  }
}
