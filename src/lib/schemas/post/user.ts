import { z } from "zod";

export const UserForPostSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().url(),
    username: z.string(),
});