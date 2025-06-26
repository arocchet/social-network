import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    password: z.string().min(6).nullable().optional(),
    birthDate: z.string().min(1, { message: "Date of birth is required" }).nullable().optional(),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    lastName: z.string().min(3, "LastName must be at least 3 characters").nullable().optional(),
    firstName: z.string().min(3, "FirstName must be at least 3 characters").nullable().optional(),
    avatar: z.string().url().nullable().optional(),
    banner: z.string().url().nullable().optional(),
    biography: z.string().max(500, "Bio must be less than 500 characters").nullable().optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PUBLIC").optional(),
});

export type User = z.infer<typeof UserSchema>;