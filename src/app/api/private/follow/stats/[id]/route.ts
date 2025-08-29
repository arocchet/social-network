import { checkFriendshipInDb } from "@/lib/db/friendship/checkFriendship";
import { countFollow } from "@/lib/db/friendship/countFollow";
import { createFriendshipInDb } from "@/lib/db/friendship/createFriendship";
import { deleteFriendshipInDb } from "@/lib/db/friendship/deleteFriendship";
import { getUser } from "@/lib/db/user/getUser";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { ProfileVisibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: any
) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json(respondError("Follow ID is required"), {
				status: 400,
			});
		}

		const searchUser = await getUser({ userId: id });

		// Check if the user exists
		if (!searchUser) {
			return NextResponse.json(respondError("Follower not found"), {
				status: 404,
			});
		}

		const stats = await countFollow({ userId: searchUser.id });

		if (!stats) {
			return NextResponse.json(
				respondError("Friendships not found"),
				{ status: 404 }
			);
		}

		return NextResponse.json(
			respondSuccess(stats, "Stats retrieved successfully"),
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error retrieving followers:", err);
		return NextResponse.json(
			respondError(
				err instanceof Error ? err.message : "Unexpected server error"
			),
			{ status: 500 }
		);
	}
}