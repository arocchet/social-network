import { UserPublicSchema } from "./public";
import { UserPrivateSchema } from "./private";
import { UserEditableSchema } from "./editable";
import { UserUpdateSchema } from "./update";
import { UserMinimalSchema } from "./minimal";

import {
    CredentialsLoginSchema,
    RegisterUserFormSchema,
    RegisterUserInputSchema,
    FormStepSchema,
} from "./auth";

export * from "./auth"
export * from "./base"
export * from "./editable"
export * from "./minimal"
export * from "./private"
export * from "./public"
export * from "./update"


export const UserSchemas = {
    Public: UserPublicSchema,
    Private: UserPrivateSchema,
    Editable: UserEditableSchema,
    Update: UserUpdateSchema,
    Minimal: UserMinimalSchema,

    Auth: {
        CredentialsLogin: CredentialsLoginSchema,
        RegisterUserForm: RegisterUserFormSchema,
        RegisterUserInput: RegisterUserInputSchema,
        FormStep: FormStepSchema
    },
};