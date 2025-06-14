import { db } from "..";

async function findUserByEmail(email: string) {
    return await db.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
        }
    })
}

export { findUserByEmail }