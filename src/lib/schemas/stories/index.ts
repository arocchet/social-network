import { UseUserStoriesParamsSchema } from "./params";
import { UserStoriesGroupSchema } from "./group";
import { ReactionSchema } from "./reaction";
import { StoryWithDetailsSchema } from "./story";
import { CreateStorySchema } from "./create";

export * from "./create"
export * from "./group"
export * from "./reaction"
export * from "./story"
export * from "./params"


export const StorySchemas = {
    StoryWithDetails: StoryWithDetailsSchema,
    UserStoriesGroup: UserStoriesGroupSchema,
    Reaction: ReactionSchema,
    Params: UseUserStoriesParamsSchema,
    Create: CreateStorySchema
};