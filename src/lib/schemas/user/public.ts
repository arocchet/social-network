import { z } from "zod";
import { UserSchema } from "./base";

/**
 * Affichage public : on masque email et password pour la sécurité.
 */
export const UserPublicSchema = UserSchema.omit({
    email: true,
    password: true,
    createdAt: true,
    updatedAt: true,
});

export type UserPublic = z.infer<typeof UserPublicSchema>;