import { getGoogleTokens } from '@/lib/server/oauth/google/getTokens';
import { fetchGoogleUserInfo } from '@/lib/server/oauth/google/fetchGoogleUserInfo';
import { resolveGoogleFlow } from './resolveFlow';


export async function handleGoogleCallback({ code, origin }: { code: string; origin: string }) {
    const tokens = await getGoogleTokens(code);
    const userInfo = await fetchGoogleUserInfo();

    return await resolveGoogleFlow({ userInfo, tokens, origin });
}