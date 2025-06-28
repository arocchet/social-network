import { z } from "zod";
import { StoryWithDetailsSchema } from "./story";
import { StoryUserSchema } from "./user";

export const UserStoriesGroupSchema = z.object({
    user: StoryUserSchema,
    stories: z.array(StoryWithDetailsSchema),
    hasUnviewed: z.boolean(),
});

export type UserStoriesGroup = z.infer<typeof UserStoriesGroupSchema>;
