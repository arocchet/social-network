import { z } from "zod";
import { ReactionSchema } from "./reaction";
import { StoryUserSchema } from "./user";

export const StoryWithDetailsSchema = z.object({
    id: z.string(),
    media: z.string().url(),
    datetime: z.string(), // ou z.coerce.date() pour parser directement
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'FRIENDS']),
    user: StoryUserSchema,
    reactions: z.array(ReactionSchema),
});

export type StoryWithDetails = z.infer<typeof StoryWithDetailsSchema>;
