import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function verifyJwt(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('"exp" claim timestamp check failed')) {
                throw new Error('Token expired: The provided token has expired.');
            } else if (error.message.toLowerCase().includes('invalid')) {
                throw new Error('Invalid token: The provided token is invalid.');
            } else {
                throw new Error(`Token verification error: ${error.message}`);
            }
        }
    }
}