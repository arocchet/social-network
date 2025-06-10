import { login } from "@/lib/auth/server/credentials/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { email, password } = await req.json();
        const token = await login(email, password);

        const res = NextResponse.json({ success: true });
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes("invalid")) {
                return NextResponse.json({ errors: { general: "Invalid email of password" } }, { status: 401 })
            }
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}