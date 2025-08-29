import { register } from "@/lib/db/queries/user/registerUser";
import { GoogleOAuth, GoogleToken } from "@/lib/schemas/oauth/";
import { SourceEnum } from "@/lib/schemas/user/auth";
import { encryptValue } from "@/lib/security/encryptToken";

type Params = {
    userInfo: GoogleOAuth;
    tokens: GoogleToken;
    origin: string;
    source: SourceEnum;
}

export async function registerGoogleOAuthUser({ userInfo, tokens, source }: Params) {
    if (!userInfo.email) throw new Error("Email is required");
    if (!userInfo.id) throw new Error("Google ID is required");
    if (!source) throw new Error("Source is required");

    const encryptedAccessToken = tokens.access_token
        ? await encryptValue(tokens.access_token)
        : null;

    const encryptedRefreshToken = tokens.refresh_token
        ? await encryptValue(tokens.refresh_token)
        : null;

    const user = await register({
        email: userInfo.email,
        lastName: userInfo.family_name ?? undefined,
        avatar: userInfo.picture ?? undefined,
        source,
        providerAccountId: userInfo.id,
        firstName: userInfo.given_name ?? undefined,
        tokens: {
            access_token: encryptedAccessToken ?? undefined,
            refresh_token: encryptedRefreshToken ?? undefined,
            scope: tokens.scope,
            id_token: tokens.id_token ?? undefined,
            expiry_date: tokens.expiry_date ?? undefined,
            token_type: tokens.token_type ?? undefined,
        },
    });

    return user;
}