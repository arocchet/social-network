import { z } from "zod";
import { UserForPostSchema } from "../post/user";
import { ReactionSchema } from "../reaction/base";

export const CommentSchema = z
  .object({
    id: z.string(),
    datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid datetime format",
    }),
    message: z.string(),
    user: UserForPostSchema,
    reactions: z.array(ReactionSchema).optional(),
    _count: z
      .object({
        reactions: z.number(),
      })
      .optional(),
  })
  .describe("CommentSchema");

export type Comment = z.infer<typeof CommentSchema>;
