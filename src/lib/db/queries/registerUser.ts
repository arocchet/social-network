import { db } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { RegisterUserInput } from '@/lib/types/types';
import { generateUsername } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export async function register(input: RegisterUserInput) {
    const {
        email,
        username,
        password,
        source,
        providerAccountId,
        tokens,
        id,
        firstName,
        lastName,
        birthDate,
        bio,
        avatar,
        banner
    } = input;

    if (!email) throw new Error("Email is required");
    if (source === 'credentials' && !password) throw new Error("Password is required for credentials");
    if (source !== 'credentials') {
        if (!providerAccountId) throw new Error("providerAccountId is required for OAuth providers");
        if (!tokens?.access_token) throw new Error("Access token is required for OAuth");
    }

    const existing = await db.user.findFirst({
        where: {
            OR: [
                { email },
                username ? { username } : undefined
            ].filter(Boolean) as Prisma.UserWhereInput[]
        }
    });

    if (existing) {
        if (existing.email === email) throw new Error("Email already in use");
        if (existing.username === username) throw new Error("Username already in use");
    }

    const newUser = await db.user.create({
        data: {
            id: id ?? undefined,
            email,
            password: password ? await hashPassword(password) : null,
            username: username ? username : generateUsername(email),
            firstName,
            lastName,
            birthDate,
            bio,
            avatar,
            banner
        }
    });

    if (source !== 'credentials' && providerAccountId) {
        await db.account.create({
            data: {
                userId: newUser.id,
                provider: source,
                id_token: tokens?.id_token,
                providerAccountId,
                access_token: tokens?.access_token,
                refresh_token: tokens?.refresh_token,
                expires_at: tokens?.expiry_date,
                scope: tokens?.scope,
                token_type: tokens?.token_type
            }
        });
    }

    return {
        ...newUser,
        providerAccountId,
    }
}