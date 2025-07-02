import { CreatePostSchema } from "./create";
import { PostSchema } from "./base";
import { PostWithDetailsSchema } from "./postWithDetails";

export * from "./postWithDetails";
export * from "./create";
export * from "./base";

export const PostSchemas = {
    full: PostSchema,
    create: CreatePostSchema,
    Details: PostWithDetailsSchema
};
