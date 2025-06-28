import { JWT_EXPIRATION } from "@/config/auth";
import { SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
export async function signJwt(payload: any, expiresIn: string = JWT_EXPIRATION.DEFAULT): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secretKey);
}
