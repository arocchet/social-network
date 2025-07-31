import { checkFriendshipInDb } from "@/lib/db/friendship/checkFriendship";
import { createFriendshipInDb } from "@/lib/db/friendship/createFriendship";
import { deleteFriendshipInDb } from "@/lib/db/friendship/deleteFriendship";
import { getUser } from "@/lib/db/user/getUser";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { ProfileVisibility } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id: followId } = await params;
		if (!followId) {
			return NextResponse.json(respondError("Follow ID is required"), {
				status: 400,
			});
		}

		const follow = await getUser({ userId: followId });

		// Check if the user exists
		if (!follow) {
			return NextResponse.json(respondError("Follower not found"), {
				status: 404,
			});
		}

		const userId = _req.headers.get("x-user-id");
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
		if (!existingFriendship || existingFriendship.status !== "followed") {
			return NextResponse.json(
				respondError("Follow relationship not found"),
				{ status: 404 }
			);
		}

		return NextResponse.json(
			respondSuccess({ status: existingFriendship.status }, "Follow status retrieved successfully"),
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
	{ params }: { params: { id: string } }
) {
	try {
		const { id: followId } = await params;
		if (!followId) {
			return NextResponse.json(respondError("Follow ID is required"), {
				status: 400,
			});
		}

		const follow = await getUser({ userId: followId });

		// Check if the user exists
		if (!follow) {
			return NextResponse.json(respondError("Follower not found"), {
				status: 404,
			});
		}

		const userId = _req.headers.get("x-user-id");
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
			if (existingFriendship.status === "accepted") {
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

			// Create a new follow relationship (only for PUBLIC accounts)
			console.log('Follow visibility:', follow.visibility, 'ProfileVisibility.PUBLIC:', ProfileVisibility.PUBLIC);
			
			// On ne peut follow que les comptes publics
			if (follow.visibility !== ProfileVisibility.PUBLIC) {
				return NextResponse.json(
					respondError("Cannot follow private accounts. Use friend request instead."),
					{ status: 400 }
				);
			}
			
			const status = "followed";
			console.log('Follow status will be:', status);

			const newFriendship = await createFriendshipInDb({
				followId: followId,
				userId: userId,
				status: status,
			});

			if (!newFriendship) {
				return NextResponse.json(
					respondError("Failed to create friendship"),
					{ status: 500 }
				);
			}

			// Si c'est un follow (compte public), pas besoin de relation bidirectionnelle
			// Seuls les amis acceptés ont une relation bidirectionnelle

			// If the follow is pending, we can send a notification or handle it accordingly
			if (status === "pending") {
				// TODO: Implement notification logic here
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
