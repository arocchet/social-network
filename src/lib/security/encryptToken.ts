import { EncryptJWT, jwtDecrypt } from "jose";

// Convertit ta string secrète en clé de chiffrement AES
export async function getEncryptionKey() {
    const ENCRYPTION_SECRET = process.env.OAUTH_TOKEN_ENCRYPTION_KEY;
    if (!ENCRYPTION_SECRET) {
        throw new Error("Missing OAUTH_TOKEN_ENCRYPTION_KEY env variable");
    }
    
    const encoder = new TextEncoder();
    const encoded = encoder.encode(ENCRYPTION_SECRET);

    const hash = await crypto.subtle.digest("SHA-256", encoded); // 32 bytes = 256 bits

    return crypto.subtle.importKey(
        "raw",
        hash,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}
export async function encryptValue(value: string): Promise<string> {
    const key = await getEncryptionKey();
    const now = Math.floor(Date.now() / 1000);

    return await new EncryptJWT({ value })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt(now)
        .setExpirationTime(now + 60 * 60 * 24 * 30) // 30 jours
        .encrypt(key);
}

export async function decryptToken<T = any>(encryptedJWT: string): Promise<T> {
    const key = await getEncryptionKey();

    const { payload } = await jwtDecrypt(encryptedJWT, key, {
        clockTolerance: 5, // secondes de tolérance (utile si les horloges diffèrent légèrement)
    });

    return payload as T;
}