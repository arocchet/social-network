import { z } from "zod";
import { UserForPostSchema } from "./user";

export const PostSchema = z.object({
    id: z.string(),
    userId: z.string(),
    message: z.string(),
    image: z.string().url().nullable(),
    datetime: z.string(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    _count: z.object({ comments: z.number(), reactions: z.number() }),
    user: UserForPostSchema,
}).describe('PostSchema');

export type Post = z.infer<typeof PostSchema>