import { db } from '@/lib/db'
import { hashPassword } from '@/lib/hash'
import { RegisterDataWithUrls } from '@/lib/types/types';

export async function register(new_user: RegisterDataWithUrls) {
    const existingUser = await db.user.findFirst({
        where: {
            OR: [
                { email: new_user.email },
                { username: new_user.username }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === new_user.email) {
            throw new Error("Email already used");
        }
        if (existingUser.username === new_user.username) {
            throw new Error("Username already used");
        }
    }

    const hashed = await hashPassword(new_user.password);

    const user = await db.user.create({
        data: {
            id: new_user.id,
            email: new_user.email,
            password: hashed,
            username: new_user.username,
            firstName: new_user.firstname,
            lastName: new_user.lastname,
            birthDate: new_user.dateOfBirth,
            biography: new_user.biography,
            ...(new_user.avatar && { avatar: new_user.avatar }),
            ...(new_user.cover && { banner: new_user.cover }),
        }
    });

    return user;
}
