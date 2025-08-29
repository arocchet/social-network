import { google } from 'googleapis';
import { oauth2Client } from './client';
import { OAuthSchemas } from '@/lib/schemas/oauth';
import { GoogleOAuth } from '@/lib/schemas/oauth/';

export async function fetchGoogleUserInfo(): Promise<GoogleOAuth> {
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
    if (!data.email || !data.id) throw new Error('Missing user info');

    const parsed = OAuthSchemas.GoogleUser.safeParse(data);
    if (!parsed.success) {
        throw new Error('Google user info validation failed: ' + JSON.stringify(parsed.error.format()));
    }

    return parsed.data;
}