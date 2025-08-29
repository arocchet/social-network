import { z } from "zod";

export const GoogleOAuthSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).nullable().optional(),
    family_name: z.string().nullable().optional(),
    given_name: z.string().nullable().optional(),
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    picture: z.string().url({ message: "Picture URL is invalid" }).nullable().optional(),
});

export const GoogleTokenSchema = z.object({
    access_token: z.string().nullable().optional(),
    expiry_date: z.number().nullable().optional(),
    id_token: z.string().nullable().optional(),
    refresh_token: z.string().nullable().optional(),
    scope: z.string().optional(),
    token_type: z.string().nullable().optional(),
});

export type GoogleOAuth = z.infer<typeof GoogleOAuthSchema>;
export type GoogleToken = z.infer<typeof GoogleTokenSchema>;