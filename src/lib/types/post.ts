import { z } from "zod";
import { PostSchema } from "@/lib/validations/createPostSchemaZod";
import type { User } from "./user";

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
    user: User;
    userId: string;
    username: string;
    visibility: "PUBLIC" | "PRIVATE";
}

export type CreatePostForm = z.infer<typeof PostSchema>;
