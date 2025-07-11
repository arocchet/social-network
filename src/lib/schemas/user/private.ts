import { z } from "zod";
import { UserSchema } from "./base";

/**
 * Affichage privée : on masque password pour la sécurité.
 */
export const UserPrivateSchema = UserSchema.omit({
    password: true,
}).describe('UserPrivateSchema');

export type UserPrivate = z.infer<typeof UserPrivateSchema>;