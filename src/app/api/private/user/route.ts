import { verifyJwt } from "@/lib/jwt/verifyJwt";
import { UserPublic, UserSchemas } from "@/lib/schemas/user";
import { respondError, respondSuccess } from "@/lib/server/api/response";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
        payload = await verifyJwt(token);
    } catch {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    const userData = await getUserByIdServer<UserPublic>(userId, UserSchemas.Public);

    if (!userData) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
}
