import { z } from "zod";
import { UserSchema } from "./base";

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

export type UserEditable = z.infer<typeof UserEditableSchema>;
