import { z } from "zod";
import { PostSchema } from "./base";
import { CommentSchema } from "../comment";
import { ReactionSchema } from "../reaction";

export const PostWithDetailsSchema = PostSchema.extend({
    comments: z.array(CommentSchema),
    reactions: z.array(ReactionSchema),
}).describe('PostWithDetailsSchema');

export type PostWithDetails = z.infer<typeof PostWithDetailsSchema>;