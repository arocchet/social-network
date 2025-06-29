import { ReactionSchema } from "./base"
import { CreateReactionSchema } from "./create";

export * from "./base"
export * from "./create"


export const ReactionSchemas = {
    Reaction: ReactionSchema,
    Create: CreateReactionSchema
};