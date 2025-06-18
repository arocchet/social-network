import { z } from "zod";

export const UserInfoSchema = z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    name: z.string().min(1, "Name is required"),
    birthDate: z.string().min(1, { message: "Date of birth is required" }).nullable().optional(),
    username: z.string().min(3, "Username must be at least 3 characters").nullable().optional(),
    lastName: z.string().min(3, "LastName must be at least 3 characters").nullable().optional(),
    firstName: z.string().min(3, "FirstName must be at least 3 characters").nullable().optional(),
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
    password: z.string().optional(), // On le valide mais on exclura à l’export public
});

// --- Variantes dérivées ---

// Public : tout sauf email et password (pour affichage profil public)
export const UserInfoPublicSchema = UserInfoSchema.omit({
    email: true,
    password: true,
});
export type UserInfoPublic = z.infer<typeof UserInfoPublicSchema>;

export const UserInfoProfileSchema = UserInfoSchema.pick({
    id: true,
    email: true,
    username: true,
    avatar: true,
    banner: true,
    biography: true,
    lastName: true,
    birthDate: true,
    firstName: true,
});

// Minimal : utile pour listes, aperçus, cartes utilisateurs
export const UserInfoMinimalSchema = UserInfoSchema.pick({
    id: true,
    username: true,
    avatar: true,
    name: true,
});
export type UserInfoMinimal = z.infer<typeof UserInfoMinimalSchema>;

// Editable : données que l'utilisateur peut modifier dans un formulaire
export const UserInfoEditableSchema = UserInfoSchema.pick({
    username: true,
    firstName: true,
    lastName: true,
    biography: true,
    location: true,
    website: true,
    avatar: true,
    banner: true,
});
export type UserInfoEditable = z.infer<typeof UserInfoEditableSchema>;

// Statistiques utilisateur (ex : panneau admin)
export const UserStatsSchema = UserInfoSchema.pick({
    id: true,
    username: true,
    followers_count: true,
    following_count: true,
    posts_count: true,
});
export type UserStats = z.infer<typeof UserStatsSchema>;

// Notification : données minimales utiles dans une notif ou auteur message
export const UserInfoNotificationSchema = UserInfoSchema.pick({
    id: true,
    username: true,
    avatar: true,
});
export type UserInfoNotification = z.infer<typeof UserInfoNotificationSchema>;

// Onboarding partiel (email obligatoire, autres champs optionnels et permissifs)
export const OnboardingUserSchema = z.object({
    email: z.string().email(),
    id: z.string().uuid().optional(),
    username: z.string().min(3).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.string().optional(), // date sous forme string ou ISO
    avatar: z.string().url().nullable().optional(),
    banner: z.string().url().nullable().optional(),
    biography: z.string().max(500).nullable().optional(),
});
