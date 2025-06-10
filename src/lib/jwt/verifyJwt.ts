import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function verifyJwt(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('expired')) {
                throw new Error('Token expired: The provided token has expired.');
            } else if (error.message.includes('invalid') || error.message.includes('Invalid')) {
                throw new Error('Invalid token: The provided token is invalid.');
            } else {
                throw new Error(`Token verification error: ${error.message}`);
            }
        } else {
            throw new Error('An unknown error occurred while verifying the token.');
        }
    }
}