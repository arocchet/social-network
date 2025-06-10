import { z } from "zod";
import { Credentials_Schema_Login, Credentials_Schema_Register } from "@/lib/validations/auth";

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