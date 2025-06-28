import { z } from "zod";
import { ReactionUserSchema } from "./user";

export const ReactionSchema = z.object({
    id: z.string(),
    type: z.enum(['LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY']),
    user: ReactionUserSchema,
});

export type StoryReaction = z.infer<typeof ReactionSchema>;
