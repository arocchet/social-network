import { NextRequest, NextResponse } from 'next/server';
import { handleGoogleCallback } from '@/lib/auth/server/oauth/google/callBackHandler';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        const cookies = req.cookies.get('oauth_state');
        const storedState = cookies?.value || '';

        const origin = `${url.protocol}//${url.host}`;

        if (!code || !state || !storedState || state !== storedState) {
            return new NextResponse('Invalid OAuth state', { status: 403 });
        }

        const result = await handleGoogleCallback({ code, origin });

        const response = NextResponse.redirect(result.location);

        response.cookies.set('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: result.type === 'success' ? 8 * 60 * 60 : 10 * 60,
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('[OAuth Callback Error]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
