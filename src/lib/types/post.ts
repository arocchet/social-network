import { z } from "zod";
import { PostSchema } from "@/lib/validations/createPostSchemaZod";
import { StorySchema } from "../validations/createStorySchemaZod";
import { UserPublic } from "../schemas/user/public";

export interface Post {
    _count: {
        comments: number;
        reactions: number;
    };
    avatar: string;
    content: string;
    datetime: string;
    id: string;
    image: string;
    message: string;
    user: UserPublic;
    userId: string;
    username: string;
    visibility: "PUBLIC" | "PRIVATE";
}

export type CreatePostForm = z.infer<typeof PostSchema>;
export type CreateStoryForm = z.infer<typeof StorySchema>;
// export type CreateStoryForm = z.infer<typeof StorySchema>;

// TODO