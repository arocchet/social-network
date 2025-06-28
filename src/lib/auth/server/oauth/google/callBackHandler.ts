import { getGoogleTokens } from '@/lib/auth/server/oauth/google/getTokens';
import { fetchGoogleUserInfo } from '@/lib/auth/server/oauth/google/fetchGoogleUserInfo';
import { resolveGoogleFlow } from './resolveFlow';
import { GoogleToken } from '@/lib/validations/auth';

export async function handleGoogleCallback({ code, origin }: { code: string; origin: string }) {
    const tokens: GoogleToken = await getGoogleTokens(code);
    const userInfo = await fetchGoogleUserInfo();

    return await resolveGoogleFlow({ userInfo, tokens, origin });
}