import { CreatePostSchema } from "./create";
import { PostSchema } from "./post";

export * from "./post";
export * from "./create";


export const PostSchemas = {
    full: PostSchema,
    create: CreatePostSchema,
    //   update: UpdatePostSchema,  // futur schéma si besoin
};
