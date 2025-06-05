import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { handleGoogleCallback } from '@/lib/auth/server/oauth/register/google';
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const cookies = parse(req.headers.get('cookie') || '');
        const storedState = cookies.oauth_state || '';
        const origin = `${url.protocol}//${url.host}`;

        if (!code || !state || !storedState || state !== storedState) {
            return new NextResponse('Invalid OAuth state', { status: 403 });
        }

        const result = await handleGoogleCallback({ code, origin });

        if (result.type === 'redirect' && result.location) {
            return NextResponse.redirect(result.location);
        }

        return new NextResponse(result.message, { status: result.status });
    } catch (err) {
        console.error('[OAuth Callback Error]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}