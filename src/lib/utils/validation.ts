import { z } from "zod";

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error("❌ Zod validation failed");
        console.dir(result.error.format(), { depth: null });
        throw new Error("Validation failed");
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