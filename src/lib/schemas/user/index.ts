import { UserPublicSchema } from "./public";
import { UserPrivateSchema } from "./private";
import { UserEditableSchema } from "./editable";
import { UserUpdateSchema } from "./update";
import { UserMinimalSchema } from "./minimal";

import {
    CredentialsLoginSchema,
    RegisterUserFormSchema,
    RegisterUserInputSchema,
} from "./auth";

import type { UserPublic } from "./public";
import type { UserPrivate } from "./private";
import type { UserEditable } from "./editable";
import type { UserUpdate } from "./update";
import type { UserMinimal } from "./minimal";

import type { CredentialsLogin, RegisterUserFormData, RegisterUserInput } from "./auth";

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
    },
};

export type UserSchemas = {
    Public: UserPublic;
    Private: UserPrivate;
    Editable: UserEditable;
    Update: UserUpdate;
    Minimal: UserMinimal;

    Auth: {
        CredentialsLogin: CredentialsLogin;
        RegisterUserForm: RegisterUserFormData;
        RegisterUserInput: RegisterUserInput;
    };
};
