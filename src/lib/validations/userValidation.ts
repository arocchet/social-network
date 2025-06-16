// lib/validations/userSchemaZod.ts
import { z } from "zod";

export const UserInfoSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1, "Name is required"),
    birthDate: z.string().min(1, { message: "Date of birth is required" }),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    lastName: z.string().min(3, "LastName must be at least 3 characters").optional(),
    firstName: z.string().min(3, "FirstName must be at least 3 characters").optional(),
    avatar: z.string().url().optional().nullable(),
    banner: z.string().url().optional().nullable(),
    biography: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
    location: z.string().max(100, "Location must be less than 100 characters").optional().nullable(),
    website: z.string().url().optional().nullable(),
    verified: z.boolean().default(false),
    followers_count: z.number().int().min(0).default(0),
    following_count: z.number().int().min(0).default(0),
    posts_count: z.number().int().min(0).default(0),
    created_at: z.date(),
    updated_at: z.date(),
    // Exclure explicitement le password des données de retour
    password: z.string().optional(), // On l'inclut pour la validation mais on l'exclura du retour
});

export const PublicUserInfoSchema = UserInfoSchema.omit({ password: true });

export type UserInfo = z.infer<typeof UserInfoSchema>;
export type PublicUserInfo = z.infer<typeof PublicUserInfoSchema>;