import { z } from "zod";
import { UserForPostSchema } from "../post/user";

export const CommentSchema = z.object({
    id: z.string(),
    datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid datetime format",
    }),
    message: z.string(),
    user: UserForPostSchema,
}).describe('CommentSchema');

export type Comment = z.infer<typeof CommentSchema>;