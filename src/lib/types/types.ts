import { z } from "zod";
import { Credentials_Schema_Login, Credentials_Schema_Register } from "@/lib/validations/authSchemaZod";

export type Credentials_Register = z.infer<typeof Credentials_Schema_Register>;

export type Credentials_Login = z.infer<typeof Credentials_Schema_Login>;


export type RegisterDataWithUrls = Omit<Credentials_Register, 'avatar' | 'cover' | "dateOfBirth"> & {
    id: string,
    avatar?: string | null
    cover?: string | null
    dateOfBirth: Date
}

export type RegisterResponse = { success: boolean };

export type LoginFormErrors = Partial<Credentials_Login> & {
    general?: string;
};

export type GoogleOAuth = {
    googleId?: string | null | undefined;
    email?: string | null | undefined
    name?: string | null | undefined
    given_name?: string | null | undefined
    family_name?: string | null | undefined
    picture?: string | null | undefined
}

export type GoogleToken = {
    access_token?: string | null | undefined;
    refresh_token?: string | null;
    scope?: string | undefined;
    id_token?: string | null | undefined;
    expiry_date?: number | null | undefined;
    token_type?: string | null | undefined;
}
export type RegistrationSource = 'credentials' | 'google' | 'discord';


export interface RegisterUserInput {
    source: RegistrationSource;
    email: string;
    providerAccountId?: string;
    id?: string;

    firstName?: string;
    lastName?: string;
    username?: string;
    birthDate?: Date;
    bio?: string;
    avatar?: string;
    banner?: string;

    password?: string;
    tokens?: GoogleToken;
}

export const JWT_EXPIRATION = {
    TEN_MINUTES: '10m',           // 10 minutes
    HOUR: '60m',                 // 1 heure
    DAY: '1d',                  // 1 jour
    WEEK: '7d',                // 7 jours (604800 secondes)
    MONTH: '30d',             // 30 jours
    DEFAULT: '480m'          // 8 heures
}

export type UserInfo = {
    providerAccountId: string | undefined;
    birthDate: Date | null;
    bio: string | null;
    avatar: string | null;
    banner: string | null;
    email: string;
    password: string | null;
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
}
