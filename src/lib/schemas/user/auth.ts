import { z } from "zod"; // ta base complète utilisateur
import { UserSchema } from "./base";
import { TokensSchema } from "../oauth/base";

// 1. Base partielle commune à utiliser pour inscription/mise à jour
const UserBaseSchema = UserSchema.pick({
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    birthDate: true,
    avatar: true,
    banner: true,
    biography: true,
    password: true,
});

// Schéma login : uniquement email + password
export const CredentialsLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


// Enum pour source d’inscription
export const RegistrationSourceEnum = z.enum(["credentials", "google", "discord"]);


// Schéma inscription / mise à jour, basé sur UserBaseSchema, avec logique spécifique auth
export const RegisterUserInputSchema = UserBaseSchema
    .extend({
        source: RegistrationSourceEnum,
        tokens: TokensSchema.optional(),
        avatar: z.union([z.instanceof(File), z.string()]).optional(),
        banner: z.union([z.instanceof(File), z.string()]).optional(),
        avatarId: z.string().nullable().optional(),
        birthDate: z.union([z.string(), z.date()]).optional().nullable(),
        bannerId: z.string().nullable().optional(),
        providerAccountId: z.string().optional(),
        id: z.string().optional(),
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
    }).describe('RegisterUserInputSchema');


// Schéma simplifié pour formulaire inscription côté client (avec fichiers, dates en string etc)
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
}).describe('RegisterUserFormSchema');

export const FormStepSchema = z.object({
    editable: z.boolean(),
    id: z.string(),
    placeholder: z.string(),
    question: z.string(),
    type: z.enum(["text", "email", "date", "textarea", "select"]),
    value: z.string(),
    visible: z.boolean().optional(),
}).describe('FormStepSchema');

export type RegisterUserFormData = z.infer<typeof RegisterUserFormSchema>;
export type CredentialsLogin = z.infer<typeof CredentialsLoginSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;
export type FormStep = z.infer<typeof FormStepSchema>
export type SourceEnum = z.infer<typeof RegistrationSourceEnum>