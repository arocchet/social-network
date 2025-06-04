import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/auth/server/jwt'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const payload = await verifyJwt(token)
    if (!payload) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const res = NextResponse.next()
    res.headers.set('x-user-id', payload.userId)
    return res
}

export const config = {
    matcher: ['/dashboard/:path*', /*'/profile/:path*'*/],
}