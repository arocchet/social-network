import { z } from "zod";

export function validateSchema<T>(
    schema: z.ZodType<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
    const result = schema.safeParse(data);

    if (!result.success) {
        const flat: Record<string, string[] | undefined> = result.error.flatten().fieldErrors;
        return {
            success: false,
            errors: Object.fromEntries(
                Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? "Invalid value"])
            ),
        };
    }

    return { success: true, data: result.data };
}