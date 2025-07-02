import { db } from "../..";

async function findGoogleAccount(googleId: string) {
    const account = await db.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider: 'google',
                providerAccountId: googleId,
            },
        },
    });

    if (!account || !account.userId) {
        return null;
    }

    const user = await db.user.findUnique({
        where: { id: account.userId }
    });

    return user ? { ...account, user } : null;
}

export { findGoogleAccount }