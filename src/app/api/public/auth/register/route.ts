import { register } from "@/lib/db/queries/user/registerUser"
import { signJwt } from "@/lib/jwt/signJwt"
import { mapRegisterFormToInput } from "@/lib/parsers/formParsers"
import { handleUploads } from "@/lib/uploads/imageUploads"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData()
        const userData = await mapRegisterFormToInput(formData)
        const { avatarUrl, bannerUrl, coverId, bannerId } = await handleUploads(formData, userData.id!)

        userData.avatar = avatarUrl
        userData.banner = bannerUrl
        userData.avatarId = coverId
        userData.bannerId = bannerId

        const user = await register(userData)
        const token = await signJwt({ userId: user.id })

        const res = NextResponse.json({ success: true }, { status: 200 })
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60,
            path: '/',
        })

        return res

    } catch (error) {
        console.error("Unexpected error during registration:", error)

        if (error instanceof Error) {
            if (error.message.includes("Email")) {
                return NextResponse.json({ errors: { email: "Email already used" } }, { status: 400 })
            }
            if (error.message.includes("Username")) {
                return NextResponse.json({ errors: { username: "Username already used" } }, { status: 400 })
            }
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 })
    }
}