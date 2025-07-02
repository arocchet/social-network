import { UserPublic, UserSchemas } from "@/lib/schemas/user";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("x-user-id");


        if (!userId) {
            return NextResponse.json(respondError("Invalid user ID"), { status: 401 });
        }

        const userData = await getUserByIdServer<UserPublic>(userId, UserSchemas.Public);

        if (!userData) {
            return NextResponse.json(respondError("User not found."), { status: 404 });
        }

        return NextResponse.json(respondSuccess(userData), { status: 200 })

    } catch (error) {
        console.error("❌ Failed to get public user:", error);

        return NextResponse.json(
            respondError(
                error instanceof Error ? error.message : "Unexpected server error."
            ),
            { status: 500 }
        );
    }
}