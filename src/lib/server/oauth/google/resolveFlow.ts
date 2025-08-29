import { findUserByEmail } from '@/lib/db/queries/user/findUserByEmail';
import { findGoogleAccount } from '@/lib/db/queries/user/findGoogleAccount';
import { signJwt } from '@/lib/jwt/signJwt';
import { registerGoogleOAuthUser } from './registerGoogleUser';
import { JWT_EXPIRATION } from '@/config/auth';
import { fetchGoogleUserInfo } from './fetchGoogleUserInfo';
import { getGoogleTokens } from './getTokens';


type ResolveGoogleParams = {
    userInfo: Awaited<ReturnType<typeof fetchGoogleUserInfo>>;
    tokens: Awaited<ReturnType<typeof getGoogleTokens>>;
    origin: string;
};

export async function resolveGoogleFlow({ userInfo, tokens, origin }: ResolveGoogleParams) {
    const email = userInfo.email;
    const googleId = userInfo.id;

    if (!email) throw new Error("Email is required");

    // Cas C : compte Google lié
    if (googleId) {
        const userAccount = await findGoogleAccount(googleId);
        if (userAccount) {
            const jwt = await signJwt({ userId: userAccount.user.id });
            return { type: 'success', token: jwt, location: `${origin}/` };
        }
    }

    // Cas B : user existe mais pas lié à Google
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        const token = await signJwt({ userId: existingUser.id }, JWT_EXPIRATION.TEN_MINUTES);
        return { type: 'redirect', token: token, location: `${origin}/link-account` };
    }

    // Cas A : utilisateur inconnu, création
    const source = 'google';
    console.log(console.log("Data : ", { userInfo, tokens, origin, source }))
    const newUser = await registerGoogleOAuthUser({ userInfo, tokens, origin, source });

    // Crée un token JWT classique ou onboarding lié à ce user temporaire
    const token = await signJwt({ userId: newUser.id }, JWT_EXPIRATION.TEN_MINUTES);

    return { type: 'redirect', token: token, location: `${origin}/onboarding` };
}