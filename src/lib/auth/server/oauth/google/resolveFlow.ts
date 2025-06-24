import { findUserByEmail } from '@/lib/db/queries/findUserByEmail';
import { findGoogleAccount } from '@/lib/db/queries/findGoogleAccount';
import { signJwt } from '@/lib/jwt/signJwt';
import { registerGoogleOAuthUser } from './registerGoogleUser';
import { GoogleOAuth, GoogleToken } from '@/lib/validations/auth';
import { JWT_EXPIRATION } from '@/config/auth';


type ResolveGoogleParams = {
    userInfo: GoogleOAuth;
    tokens: GoogleToken;
    origin: string;
}

export async function resolveGoogleFlow({ userInfo, tokens, origin }: ResolveGoogleParams) {
    const email = userInfo.email;
    const googleId = userInfo.googleId;

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
    const newUser = await registerGoogleOAuthUser({ userInfo, tokens, origin, source });

    // Crée un token JWT classique ou onboarding lié à ce user temporaire
    const token = await signJwt({ userId: newUser.id }, JWT_EXPIRATION.TEN_MINUTES);

    return { type: 'redirect', token: token, location: `${origin}/onboarding` };
}