import { countFollow } from "@/lib/db/friendship/countFollow";
import { UserPublic, UserSchemas } from "@/lib/schemas/user";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { getUserByIdServer } from "@/lib/server/user/getUser";
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

		const searchUser = await getUserByIdServer<UserPublic>(id, UserSchemas.Public);

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