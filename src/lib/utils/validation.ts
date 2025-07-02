import { z } from "zod";

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const fieldErrors = Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
                ([field, errors]) => [field, (errors as string[])[0] ?? "Invalid value"]
            )
        );

        console.error("❌ Zod validation failed:", fieldErrors);
        throw new ValidationError(fieldErrors);
    }
    return result.data;
}

export class ValidationError extends Error {
    fieldErrors: Record<string, string>;

    constructor(fieldErrors: Record<string, string>) {
        super("Invalid data");
        this.name = "ValidationError";
        this.fieldErrors = fieldErrors;
    }
}