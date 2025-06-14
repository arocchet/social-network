import { z } from "zod";

export const Credentials_Schema_Register = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }).trim(),
    firstname: z.string().trim().min(1, { message: "Must contain at least 1 character" }),
    lastname: z.string().trim().min(1, { message: "Must contain at least 1 character" }),
    biography: z.string().trim().optional(),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
    avatar: z.object({
        previewUrl: z.string().nullable(),
        fileName: z.string().nullable(),
        file: z.instanceof(File).nullable()
    }).optional(),
    cover: z.object({
        previewUrl: z.string().nullable(),
        fileName: z.string().nullable(),
        file: z.instanceof(File).nullable()
    }).optional()
});

export const Credentials_Schema_Login = z.object({
    email: z.string().email({ message: "Invalid email adress" }),
    password: z.string().min(1, { message: "Must contain at least 3 character" }),
});
