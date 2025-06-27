import { z } from "zod";
import { ReactionUserSchema } from "../stories/user";

export const ReactionTypeSchema = z.enum([
    "LIKE",
    "DISLIKE",
    "LOVE",
    "LAUGH",
    "SAD",
    "ANGRY"
]);


export const ReactionSchema = z.object({
    id: z.string(),
    type: ReactionTypeSchema,
    user: ReactionUserSchema,
}).describe('ReactionSchema');

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;