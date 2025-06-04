import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!
const encoder = new TextEncoder()
const key = encoder.encode(JWT_SECRET)

const EXPIRATION = '7d'

export async function signJwt(payload: JWTPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(EXPIRATION)
        .sign(key)
}

export async function verifyJwt(token: string): Promise<{ userId: string } | null> {
    try {
        const { payload } = await jwtVerify(token, key)
        if (typeof payload !== 'object' || !payload.userId) return null
        return payload as { userId: string }
    } catch (err) {
        console.error("Invalid token:", err)
        return null
    }
}