import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/auth/server/register'
import { signJwt } from '@/lib/auth/server/jwt'
import { RegisterDataWithUrls } from '@/lib/types/types'
import { cloudinaryService } from '@/lib/cloudinary/cloudinary'
import cuid from 'cuid'

const shouldUpload = process.env.DISABLE_CLOUDINARY !== 'true'
const fallbackAvatarUrl = 'https://media.discordapp.net/attachments/1357283554769502361/1376852929633325096/image.png?ex=68401037&is=683ebeb7&hm=ce23ac84db91474439ac5b722376061c96ca64c6c15f03af6ae70665cea3aad8&=&format=webp&quality=lossless'
const fallbackCoverUrl = 'https://cdn.discordapp.com/attachments/1357283554769502361/1376847788372918342/konekt-high-resolution-logo.png?ex=68400b6d&is=683eb9ed&hm=74cdd867140f37dc46cc82122413067510c5a262a757fa0e96d53ab277427008&'
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData()
        const userId = cuid()

        const data: RegisterDataWithUrls = {
            id: userId,
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            dateOfBirth: new Date(formData.get('dateOfBirth') as string),
        }

        const avatarFile = formData.get('avatar') as File | null
        const coverFile = formData.get('cover') as File | null

        if (shouldUpload && avatarFile) {
            const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer())
            const uploadResult = await cloudinaryService.uploadImage(avatarBuffer, { format: userId, filename: avatarFile.name })
            data.avatar = uploadResult?.secure_url ?? fallbackAvatarUrl
        } else {
            data.avatar = fallbackAvatarUrl
        }

        if (shouldUpload && coverFile) {
            const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
            const uploadResult = await cloudinaryService.uploadImage(coverBuffer, { format: userId, filename: coverFile.name })
            data.cover = uploadResult?.secure_url ?? fallbackCoverUrl
        } else {
            data.cover = fallbackCoverUrl
        }


        const user = await register(data)

        const token = await signJwt({ userId: user.id })
        const res = NextResponse.json({ success: true }, { status: 200 })
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return res

    } catch (error) {
        console.error("Unexpected error during registration:", error);

        if (error instanceof Error) {
            if (error.message.includes("Email")) {
                return NextResponse.json({ errors: { email: "Email already used" } }, { status: 400 });
            }
            if (error.message.includes("Username")) {
                return NextResponse.json({ errors: { username: "Username already used" } }, { status: 400 });
            }
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { message: "Unknown error occurred" },
            { status: 500 }
        );
    }
}