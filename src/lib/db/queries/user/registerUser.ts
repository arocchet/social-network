import { db } from '@/lib/db';
import { UserSchemas } from '@/lib/schemas/user';
import { RegisterUserInput } from '@/lib/schemas/user/auth';
import { UserPublic } from '@/lib/schemas/user/public';
import { hashPassword } from '@/lib/security/hash';
import { generateUsername } from '@/lib/utils/';
import { parseOrThrow } from '@/lib/utils/';
import { Prisma } from '@prisma/client';

export async function register(input: RegisterUserInput): Promise<UserPublic> {
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
        biography,
        avatar,
        banner,
        bannerId,
        avatarId
    } = input;

    if (avatar && typeof avatar !== "string") throw new Error("Invalid avatar format; must be a string URL.");
    if (banner && typeof banner !== "string") throw new Error("Invalid banner format; must be a string URL.");
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
            biography,
            avatar,
            avatarId,
            banner,
            bannerId,

        },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            biography: true,
            avatar: true,
            avatarId: true,
            banner: true,
            bannerId: true,
            visibility: true,
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

    const userWithVisibility: UserPublic = {
        ...newUser,
        username: newUser.username ?? undefined,
        birthDate: newUser.birthDate?.toISOString(),
    };

    return parseOrThrow(UserSchemas.Public, userWithVisibility);

}