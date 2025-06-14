import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { GOOGLE_SCOPES, oauth2Client } from '@/lib/auth/server/oauth/google/client';

export async function GET() {
    const cookieStore = await cookies();
    const state = crypto.randomBytes(32).toString('hex');

    cookieStore.set('oauth_state', state, {
        httpOnly: true,
        path: '/',
        maxAge: 300,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: GOOGLE_SCOPES,
        include_granted_scopes: true,
        state,
        prompt: 'consent',
    });

    return NextResponse.redirect(authorizationUrl);
}