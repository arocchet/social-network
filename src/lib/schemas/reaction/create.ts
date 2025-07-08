import { z } from "zod";
import { ReactionTypeSchema } from "./base";

export const CreateReactionSchema = z.object({
  type: ReactionTypeSchema,
  contentType: z.enum(["post", "stories", "comment"]),
  mediaId: z.string().cuid(),
});

export type CreateReaction = z.infer<typeof CreateReactionSchema>;
