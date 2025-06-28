import { UseUserStoriesParamsSchema } from "./params";
import { UserStoriesGroupSchema } from "./group";
import { ReactionSchema } from "./reaction";
import { StoryWithDetailsSchema } from "./story";

import type { UseUserStoriesParams } from "./params";
import type { UserStoriesGroup } from "./group";
import type { StoryReaction } from "./reaction";
import type { StoryWithDetails } from "./story";

export const StorySchemas = {
    StoryWithDetails: StoryWithDetailsSchema,
    UserStoriesGroup: UserStoriesGroupSchema,
    Reaction: ReactionSchema,
    Params: UseUserStoriesParamsSchema,
};

export type StorySchemas = {
    StoryWithDetails: StoryWithDetails;
    UserStoriesGroup: UserStoriesGroup;
    Reaction: StoryReaction;
    Params: UseUserStoriesParams;
};
