import { db } from '@/lib/db'
import { comparePasswords } from '@/lib/hash'
import { signJwt } from '@/lib/auth/server/jwt'


export async function login(email: string, password: string): Promise<string> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid Email or Password')

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) throw new Error('Invalid Email or Password')

    const token = await signJwt({ userId: user.id });
    return token;
}