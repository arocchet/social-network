import { z } from "zod";
import { UserForPostSchema } from "./user";

export const PostSchema = z.object({
    id: z.string(),
    userId: z.string(),
    message: z.string(),
    image: z.string().url().nullable(), // nullable pour accepter `null`
    mediaId: z.string().nullable(),     // inclus dans tes données
    datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid datetime format",
    }),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    _count: z.object({
        comments: z.number().int().nonnegative(),
        reactions: z.number().int().nonnegative(),
    }),
    user: UserForPostSchema,
});
export type Post = z.infer<typeof PostSchema>