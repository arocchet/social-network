import { z } from "zod";
import { UserEditableSchema } from "./editable";

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
}).describe('UserUpdateSchema');

export type UserUpdate = z.infer<typeof UserUpdateSchema>

