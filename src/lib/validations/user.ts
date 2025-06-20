import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    password: z.string().min(6),
    birthDate: z.string().min(1, { message: "Date of birth is required" }).nullable().optional(),
    username: z.string().min(3, "Username must be at least 3 characters").nullable().optional(),
    lastName: z.string().min(3, "LastName must be at least 3 characters").nullable().optional(),
    firstName: z.string().min(3, "FirstName must be at least 3 characters").nullable().optional(),
    avatar: z.string().url().nullable().optional(),
    banner: z.string().url().nullable().optional(),
    biography: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Affichage public : on masque email et password pour la sécurité.
 */
export const UserPublicSchema = UserSchema.omit({
    email: true,
    password: true,
    createdAt: true,
    updatedAt: true,
});

/**
 * Formulaire d'édition utilisateur : champs modifiables
 * ici on exclut id, createdAt, updatedAt, verified, password
 */
export const UserEditableSchema = UserSchema.pick({
    email: true,
    username: true,
    avatar: true,
    banner: true,
    biography: true,
    birthDate: true,
    firstName: true,
    lastName: true,
});

/**
 * Vue minimale, utilisée par exemple dans les listes ou notifications.
 * Juste les infos essentielles pour afficher un user compact.
 */
export const UserMinimalSchema = UserSchema.pick({
    id: true,
    username: true,
    avatar: true,
});

/**
 * Données utiles pour authentification, on ne veut que l'essentiel
 */
export const UserAuthSchema = UserSchema.pick({
    id: true,
    email: true,
    password: true,

});

/**
 * Utilisateur pour affichage complet backoffice/admin
 * Peut inclure aussi les dates de création/màj.
 */
export const UserAdminSchema = UserSchema.omit({
    password: true,
});

/**
 * Schéma partiel pour mise à jour utilisateur.
 * Tous les champs sont optionnels, incluant avatarId et bannerId.
 * birthDate accepte Date ou chaîne ISO valide.
 * Utile pour valider les données lors d'une modification partielle.
 */
export const UserUpdateSchema = UserEditableSchema.partial().extend({
    birthDate: z
        .union([
            z.date(),
            z.string().refine(
                (str) => !str || !isNaN(Date.parse(str)),
                { message: "Invalid date format" }
            ),
        ])
        .optional(),
    avatarId: z.string().optional(),
    bannerId: z.string().optional(),
});

/**
 * TypeScript : on génère les types correspondants automatiquement
 */

export type User = z.infer<typeof UserSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type UserEditable = z.infer<typeof UserEditableSchema>;
export type UserMinimal = z.infer<typeof UserMinimalSchema>;
export type UserAuth = z.infer<typeof UserAuthSchema>;
export type UserAdmin = z.infer<typeof UserAdminSchema>;