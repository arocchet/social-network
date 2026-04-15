import { checkFriendshipInDb } from "@/lib/db/friendship/checkFriendship";
import { createFriendshipInDb } from "@/lib/db/friendship/createFriendship";
import { deleteFriendshipInDb } from "@/lib/db/friendship/deleteFriendship";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { InvitationStatus, ProfileVisibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/server/api/getUserId";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { UserPublic, UserSchemas } from "@/lib/schemas/user";

export async function GET(
	_req: NextRequest,
	{ params }: any
) {
	try {
		const { id: followId } = await params;
		if (!followId) {
			return NextResponse.json(respondError("Follow ID is required"), {
				status: 400,
			});
		}

		const follow = await getUserByIdServer<UserPublic>(followId, UserSchemas.Public);

		// Check if the user exists
		if (!follow) {
			return NextResponse.json(respondError("Follower not found"), {
				status: 400,
			});
		}

		const userId = await getUserIdFromRequest(_req);
		// Validate userId from request headers
		if (!userId) {
			return NextResponse.json(respondError("Not authenticated"), {
				status: 401,
			});
		}

		const existingFriendship = await checkFriendshipInDb({
			followId: followId,
			userId: userId,
		});

		// On ne retourne que les relationships de type "followed"
		if (!existingFriendship || existingFriendship.status !== InvitationStatus.ACCEPTED) {
			return NextResponse.json(
				respondError("Follow relationship not found"),
				{ status: 400 }
			);
		}

		return NextResponse.json(
			respondSuccess(existingFriendship, "Follow status retrieved successfully"),
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error retrieving follower:", err);
		return NextResponse.json(
			respondError(
				err instanceof Error ? err.message : "Unexpected server error"
			),
			{ status: 500 }
		);
	}
}

export async function POST(
	_req: NextRequest,
	{ params }: any
) {
	try {
		const { id: followId } = params;
		if (!followId) {
			return NextResponse.json(respondError("Follow ID is required"), {
				status: 400,
			});
		}

		const follow = await getUserByIdServer<UserPublic>(followId, UserSchemas.Public);

		// Check if the user exists
		if (!follow) {
			return NextResponse.json(respondError("Follower not found"), {
				status: 404,
			});
		}

		const userId = await getUserIdFromRequest(_req);
		// Validate userId from request headers
		if (!userId) {
			return NextResponse.json(respondError("Not authenticated"), {
				status: 401,
			});
		}

		// Check if the friendship exists
		const existingFriendship = await checkFriendshipInDb({
			followId: followId,
			userId: userId,
		});

		// If the relationship exists, cancel it
		if (existingFriendship) {
			// Supprimer la relation principale
			await deleteFriendshipInDb({
				followId: followId,
				userId: userId,
			});

			// Si c'était une amitié acceptée, supprimer aussi l'amitié inverse
			if (existingFriendship.status === InvitationStatus.ACCEPTED) {
				const reverseFriendship = await checkFriendshipInDb({
					followId: userId,
					userId: followId,
				});

				if (reverseFriendship) {
					await deleteFriendshipInDb({
						followId: userId,
						userId: followId,
					});
				}
			}

			return NextResponse.json(
				respondSuccess(null, "Friendship canceled successfully"),
				{ status: 201 }
			);
		} else {
			// Check if the user is trying to follow themselves
			if (follow.id === userId) {
				return NextResponse.json(
					respondError("You cannot follow yourself"),
					{ status: 400 }
				);
			}

			// On ne peut follow que les comptes publics
			if (follow.visibility !== ProfileVisibility.PUBLIC) {
				return NextResponse.json(
					respondError("Cannot follow private accounts. Use friend request instead."),
					{ status: 400 }
				);
			}

			const newFriendship = await createFriendshipInDb({
				followId: followId,
				userId: userId,
				status: InvitationStatus.ACCEPTED,
			});

			if (!newFriendship) {
				return NextResponse.json(
					respondError("Failed to create friendship"),
					{ status: 500 }
				);
			}

			return NextResponse.json(
				respondSuccess(newFriendship, "Friendship created successfully"),
				{ status: 201 }
			);
		}


	} catch (err) {
		console.error("Error creating friendship:", err);
		return NextResponse.json(
			respondError(
				err instanceof Error ? err.message : "Unexpected server error"
			),
			{ status: 500 }
		);
	}
}
