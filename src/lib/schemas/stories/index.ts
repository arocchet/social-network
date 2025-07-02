import { UseUserStoriesParamsSchema } from "./params";
import { UserStoriesGroupSchema } from "./group";
import { StoryWithDetailsSchema } from "./story";
import { CreateStorySchema } from "./create";

export * from "./create"
export * from "./group"
export * from "./story"
export * from "./params"


export const StorySchemas = {
    StoryWithDetails: StoryWithDetailsSchema,
    UserStoriesGroup: UserStoriesGroupSchema,
    Params: UseUserStoriesParamsSchema,
    Create: CreateStorySchema
};