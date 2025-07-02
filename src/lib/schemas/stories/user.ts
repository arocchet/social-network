import { z } from "zod";

export const StoryUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().url(),
}).describe('StoryUserSchema');

export const ReactionUserSchema = z.object({
    id: z.string(),
    username: z.string(),
}).describe('ReactionUserSchema');

export type StoryUser = z.infer<typeof StoryUserSchema>;
export type ReactionUser = z.infer<typeof ReactionUserSchema>;
