import { z } from "zod";

const dateOrString = z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional()
    .nullable();

// Login schema client
export const CredentialsSchemaLogin = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register schema client
export const RegisterUserFormSchema = z.object({
    email: z.string().email({ message: "Invalid email" }).trim(),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }).trim(),
    firstname: z.string().min(1, { message: "First name is required" }).trim(),
    lastname: z.string().min(1, { message: "Last name is required" }).trim(),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    biography: z.string().optional(),
    avatar: z.object({
        previewUrl: z.string().nullable(),
        fileName: z.string().nullable(),
        file: z.instanceof(File).nullable(),
    }).optional(),
    banner: z.object({
        previewUrl: z.string().nullable(),
        fileName: z.string().nullable(),
        file: z.instanceof(File).nullable(),
    }).optional(),
});


export const GoogleOAuthSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).nullable().optional(),
    family_name: z.string().nullable().optional(),
    given_name: z.string().nullable().optional(),
    googleId: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    picture: z.string().url({ message: "Picture URL is invalid" }).nullable().optional(),
});

export const GoogleTokenSchema = z.object({
    access_token: z.string().nullable().optional(),
    expiry_date: z.number().nullable().optional(),
    id_token: z.string().nullable().optional(),
    refresh_token: z.string().nullable().optional(),
    scope: z.string().optional(),
    token_type: z.string().nullable().optional(),
});

export const RegistrationSourceEnum = z.enum(["credentials", "google", "discord"]);

const TokensSchema = z.union([GoogleTokenSchema, z.undefined()]);

export const RegisterUserInputSchema = z
    .object({
        avatar: z.union([z.instanceof(File), z.string()]).optional(),
        banner: z.union([z.instanceof(File), z.string()]).optional(),
        avatarId: z.string().nullable().optional(),
        bannerId: z.string().nullable().optional(),
        biography: z.string().optional(),
        birthDate: z.date().optional(),
        email: z.string().email({ message: "Invalid email address" }),
        firstName: z.string().optional(),
        id: z.string().optional(),
        lastName: z.string().optional(),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
        providerAccountId: z.string().optional(),
        source: RegistrationSourceEnum,
        tokens: TokensSchema.optional(),
        username: z.string().optional(),
    })
    .superRefine(({ source, tokens, password }, ctx) => {
        if (source === "credentials" && (!password || password.length < 6)) {
            ctx.addIssue({
                code: "custom",
                message: "Password is required and must be at least 6 characters for credentials authentication.",
                path: ["password"],
            });
        }

        if (source === "google" && !tokens) {
            ctx.addIssue({
                code: "custom",
                message: "Tokens are required when source is 'google'.",
                path: ["tokens"],
            });
        }

        if (source === "credentials" && tokens !== undefined) {
            ctx.addIssue({
                code: "custom",
                message: "Tokens must be undefined when source is 'credentials'.",
                path: ["tokens"],
            });
        }
    });

export type CredentialsLogin = z.infer<typeof CredentialsSchemaLogin>;
export type RegisterUserFormData = z.infer<typeof RegisterUserFormSchema>;

export type GoogleOAuth = z.infer<typeof GoogleOAuthSchema>;
export type GoogleToken = z.infer<typeof GoogleTokenSchema>;

export type RegistrationSource = z.infer<typeof RegistrationSourceEnum>;

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;