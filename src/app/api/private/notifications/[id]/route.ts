import { getNotificationByUserId } from "@/lib/db/notifications/getNotifications";
import { postNotificationByUserId } from "@/lib/db/notifications/postNotifications";
import { respondSuccess, respondError } from "@/lib/server/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const userId = _req.headers.get("x-user-id");
		// Validate userId from request headers
		if (!userId) {
			return NextResponse.json(respondError("Not authenticated"), {
				status: 401,
			});
		}

		const notifications = await getNotificationByUserId({
			userId: userId,
		})

		return NextResponse.json(
			respondSuccess(notifications, "Notifications retrieved successfully"),
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error retrieving notifications:", err);
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
		const userId = _req.headers.get("x-user-id");
		// Validate userId from request headers
		if (!userId) {
			return NextResponse.json(respondError("Not authenticated"), {
				status: 401,
			});
		}

		const body = await _req.json();
		const { message } = body;

		if (!message) {
			return NextResponse.json(respondError("Message is required"), {
				status: 400,
			});
		}

		const notification = await postNotificationByUserId({
			userId: userId,
			message: message,
		});

		return NextResponse.json(
			respondSuccess(notification, "Notification created successfully"),
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error creating notification:", err);
		return NextResponse.json(
			respondError(
				err instanceof Error ? err.message : "Unexpected server error"
			),
			{ status: 500 }
		);
	}
}