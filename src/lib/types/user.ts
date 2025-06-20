import { z } from "zod";
import { UserInfoProfileSchema } from "@/lib/validations/userValidation";

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