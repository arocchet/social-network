import { z } from "zod";
import { ReactionTypeSchema } from "./base";

const ContentTypeEnumZod = z.enum(["post", "stories", "comment"])

export const CreateReactionSchema = z.object({
  type: ReactionTypeSchema,
  contentType: ContentTypeEnumZod,
  mediaId: z.string().cuid(),
});

export type CreateReaction = z.infer<typeof CreateReactionSchema>;
export type ContentTypeEnum = z.infer<typeof ContentTypeEnumZod>;
