import { z } from "zod";
import { Credentials_Schema_Login, Credentials_Schema_Register } from "@/lib/validations/authSchemaZod";

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
    email?: string | null;
    family_name?: string | null;
    given_name?: string | null;
    googleId?: string | null;
    name?: string | null;
    picture?: string | null;
};

export type GoogleToken = {
    access_token?: string | null;
    expiry_date?: number | null;
    id_token?: string | null;
    refresh_token?: string | null;
    scope?: string;
    token_type?: string | null;
};

export type RegistrationSource = "credentials" | "google" | "discord";

export interface RegisterUserInput {
    avatar?: string;
    avatarId?: string | null;
    banner?: string;
    bannerId?: string | null;
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
    DEFAULT: "480m",
} as const;