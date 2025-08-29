import { db } from "@/lib/db"
import { UserSchemas } from "@/lib/schemas/user";
import { parseOrThrow } from "@/lib/utils/validation";

export async function updateUserServer(userId: string, data: unknown) {
    const updates = parseOrThrow(UserSchemas.Update, data);

    if (updates.birthDate && typeof updates.birthDate === "string") {
        updates.birthDate = new Date(updates.birthDate);
    }

    await db.user.update({
        where: { id: userId },
        data: updates,
    });
}