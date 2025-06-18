import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function comparePasswords(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed)
}