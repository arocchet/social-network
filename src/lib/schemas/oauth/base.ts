import { z } from "zod";

export const TokensSchema = z.object({
    access_token: z.string().optional(),
    refresh_token: z.string().optional(),
    id_token: z.string().optional(),
    expiry_date: z.number().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
}).partial();