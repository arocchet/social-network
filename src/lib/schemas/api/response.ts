import { z } from "zod";

/**
 * Typage TypeScript : générique pour toutes tes réponses d'API
 */
export type APIResponse<T> = {
    success: boolean;
    data: T | null;
    message?: string;
    fieldErrors?: Record<string, string>;
};

/**
 * Schéma Zod générique pour valider un retour d'API
 * Exemple : apiResponseSchema(UserSchema)
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        success: z.boolean(),
        data: schema,
        message: z.string().optional(),
        fieldErrors: z.record(z.string()).optional(),
    }).describe(`API Response<${(schema._def.description ?? "Unnamed schema")}>`);

/**
 * Schéma standardisé pour une réponse d'erreur (avec data = null)
 */
export const apiErrorResponseSchema = z.object({
    success: z.literal(false),
    data: z.null(),
    message: z.string(),
    fieldErrors: z.record(z.string()).optional(),
}).describe('apiErrorResponseSchema');
