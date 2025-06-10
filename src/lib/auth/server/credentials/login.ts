import { db } from '@/lib/db'
import { comparePasswords } from '@/lib/hash'
import { signJwt } from '@/lib/jwt/signJwt';


export async function login(email: string, password: string): Promise<string> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    if (!user.password) {
        throw new Error('Invalid email or password');
    }

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    const token = signJwt({ userId: user.id });

    return token;
}