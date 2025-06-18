import { db } from "@/lib/db"
import { z } from "zod"

const updateUserSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    birthDate: z
        .union([
            z.date(),
            z.string().refine(
                (str) => !str || !isNaN(Date.parse(str)),
                { message: "Invalid date format" }
            ),
        ])
        .optional(),
    biography: z.string().max(300).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
});

export async function updateUserServer(userId: string, data: unknown) {
    const parsed = updateUserSchema.safeParse(data)

    if (!parsed.success) {
        console.error("Validation error:", parsed.error.flatten())
        throw new Error("Invalid payload")
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