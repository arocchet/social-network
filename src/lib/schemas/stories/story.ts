import { z } from "zod";
import { StoryUserSchema } from "./user";
import { ReactionSchema } from "../reaction";

export const StoryWithDetailsSchema = z.object({
    id: z.string(),
    media: z.string().url(),
    datetime: z.string(),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS']),
    user: StoryUserSchema,
    reactions: z.array(ReactionSchema),
}).describe('StoryWithDetailsSchema');

export type StoryWithDetails = z.infer<typeof StoryWithDetailsSchema>;
