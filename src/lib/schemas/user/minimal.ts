import { z } from "zod";
import { UserSchema } from "./base";

/**
 * Vue minimale, utilisée par exemple dans les listes ou notifications.
 * Juste les infos essentielles pour afficher un user compact.
 */
export const UserMinimalSchema = UserSchema.pick({
    id: true,
    username: true,
    avatar: true,
}).describe('UserMinimalSchema');


export type UserMinimal = z.infer<typeof UserMinimalSchema>;