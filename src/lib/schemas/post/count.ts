import { z } from "zod";
import { PostSchema } from "./base";

export const PostWithCountsSchema = PostSchema.extend({
    user: z.object({
        id: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        avatar: z.string().nullable(),
        username: z.string().nullable(),
    }),
    _count: z.object({
        comments: z.number(),
        reactions: z.number(),
    }),
});

export type PostWithCounts = z.infer<typeof PostWithCountsSchema>;
