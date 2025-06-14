import { register } from "@/lib/db/queries/registerUser";
import { GoogleOAuth, GoogleToken, RegistrationSource, UserInfo } from "@/lib/types/types";

type Params = {
    userInfo: GoogleOAuth;
    tokens: GoogleToken;
    origin: string;
    source: RegistrationSource;
}

export async function registerGoogleOAuthUser({ userInfo, tokens, origin, source }: Params) {
    if (!userInfo.email) throw new Error("Email is required");
    if (!userInfo.googleId) throw new Error("Google ID is required");
    if (!source) throw new Error("Source is required");

    const user: UserInfo = await register({
        email: userInfo.email,
        lastName: userInfo.family_name ?? undefined,
        avatar: userInfo.picture ?? undefined,
        source,
        providerAccountId: userInfo.googleId,
        firstName: userInfo.given_name ?? undefined,
        tokens
    });

    return user;
}