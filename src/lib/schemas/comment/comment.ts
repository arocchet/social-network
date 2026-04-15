import { z } from "zod";
import { UserForPostSchema } from "../post/user";
import { ReactionSchema } from "../reaction/base";

export const CommentSchema = z.object({
  id: z.string(),
  // Zod a un helper direct : .datetime() (ISO 8601)
  datetime: z.string().datetime(),
  message: z.string(),
  user: UserForPostSchema,
  reactions: z.array(ReactionSchema).optional(),
  _count: z
    .object({
      reactions: z.number(),
    })
    .optional(),
});

export type Comment = z.infer<typeof CommentSchema>;
