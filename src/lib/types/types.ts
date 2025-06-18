// types/index.ts

import { z } from "zod";
import {
    Credentials_Schema_Login,
    Credentials_Schema_Register,
} from "@/lib/validations/authSchemaZod";
import { PostSchema } from "@/lib/validations/createPostSchemaZod";
import { StorySchema } from "@/lib/validations/createStorySchemaZod";
import { OnboardingUserSchema, UserInfoProfileSchema } from "../validations/userValidation";
import { CommentSchema } from "../validations/createCommentSchemaZod";

/* -------------------------------------------------------------------------- */
/*                                  Auth Types                                */
/* -------------------------------------------------------------------------- */

export type Credentials_Login = z.infer<typeof Credentials_Schema_Login>;
export type Credentials_Register = z.infer<typeof Credentials_Schema_Register>;

export type RegisterDataWithUrls = Omit<
    Credentials_Register,
    "avatar" | "cover" | "dateOfBirth"
> & {
    id: string;
    avatar?: string | null;
    cover?: string | null;
    dateOfBirth: Date;
};

export type RegisterResponse = { success: boolean };

export type LoginFormErrors = Partial<Credentials_Login> & {
    general?: string;
};

export type GoogleOAuth = {
    email?: string | null | undefined;
    family_name?: string | null | undefined;
    given_name?: string | null | undefined;
    googleId?: string | null | undefined;
    name?: string | null | undefined;
    picture?: string | null | undefined;
};

export type GoogleToken = {
    access_token?: string | null | undefined;
    expiry_date?: number | null | undefined;
    id_token?: string | null | undefined;
    refresh_token?: string | null;
    scope?: string | undefined;
    token_type?: string | null | undefined;
};

export type RegistrationSource = "credentials" | "google" | "discord";

export interface RegisterUserInput {
    avatar?: string;
    banner?: string;
    biography?: string;
    birthDate?: Date;
    email: string;
    firstName?: string;
    id?: string;
    lastName?: string;
    password?: string;
    providerAccountId?: string;
    source: RegistrationSource;
    tokens?: GoogleToken;
    username?: string;
}

export const JWT_EXPIRATION = {
    TEN_MINUTES: "10m",
    HOUR: "60m",
    DAY: "1d",
    WEEK: "7d",
    MONTH: "30d",
    DEFAULT: "480m", // 8 heures
} as const;

/* -------------------------------------------------------------------------- */
/*                                  User Types                                */
/* -------------------------------------------------------------------------- */

export type UserInfo = {
    avatar: string | null;
    banner: string | null;
    biography: string | null;
    birthDate: Date | null;
    email: string;
    firstName: string | null;
    id: string;
    lastName: string | null;
    password: string | null;
    providerAccountId: string | undefined;
    username: string | null;
};

export interface User {
    avatar: string;
    biography: string;
    birthdate: Date;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    registeredAt: Date;
    userId: string;
    username: string;
}

export type UserInfoProfile = z.infer<typeof UserInfoProfileSchema>;


/* -------------------------------------------------------------------------- */
/*                                  Post Types                                */
/* -------------------------------------------------------------------------- */

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
export type CreateStoryForm = z.infer<typeof StorySchema>;
export type CreateCommentForm = z.infer<typeof CommentSchema>;

/* -------------------------------------------------------------------------- */
/*                                Onboarding Form                             */
/* -------------------------------------------------------------------------- */

export type FormStep = {
    editable: boolean;
    id: string;
    placeholder: string;
    question: string;
    type: "text" | "email" | "date" | "textarea" | "select" | "password";
    value: string;
    visible?: boolean;
};

export type OnboardingUser = z.infer<typeof OnboardingUserSchema>;