import { GoogleOAuthSchema } from "./google";
import { GoogleTokenSchema } from "./google";

export * from "./base"
export * from "./google"

export const OAuthSchemas = {
    GoogleUser: GoogleOAuthSchema,
    GoogleToken: GoogleTokenSchema,
};
