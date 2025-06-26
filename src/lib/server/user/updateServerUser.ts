import { db } from "@/lib/db"
import { UserSchemas } from "@/lib/schemas/user";
import { ValidationError } from "@/lib/utils/";

export async function updateUserServer(userId: string, data: unknown) {
    const parsed = UserSchemas.Update.safeParse(data)

    if (!parsed.success) {
        const fieldErrors = Object.fromEntries(
            Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
                k,
                v?.[0] ?? "Invalid value",
            ])
        );
        throw new ValidationError(fieldErrors);
    }
    const updates = { ...parsed.data };

    if (updates.birthDate && typeof updates.birthDate === "string") {
        updates.birthDate = new Date(updates.birthDate);
    }

    await db.user.update({
        where: { id: userId },
        data: updates,
    })
}