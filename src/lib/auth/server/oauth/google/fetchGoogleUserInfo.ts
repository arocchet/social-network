import { google } from 'googleapis';
import { oauth2Client } from './client';
import { GoogleOAuth } from '@/lib/validations/auth';

export async function fetchGoogleUserInfo(): Promise<GoogleOAuth> {
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();

    const email = data.email;
    const googleId = data.id;
    const name = data.name ?? '';
    const picture = data.picture ?? '';
    const family_name = data.family_name
    const given_name = data.given_name

    if (!email || !googleId) throw new Error('Missing user info');

    return { email, googleId, name, picture, family_name, given_name };
}