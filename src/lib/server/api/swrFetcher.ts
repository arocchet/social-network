import { z } from "zod";
import { fetcher as customFetcher } from "./fetcher";
import { apiResponseSchema } from "../../schemas/api";
import { flattenZodErrors } from "@/lib/utils/flattenZodErrors";

export async function swrFetcher<T>(url: string, schema: z.ZodType<T>) {
    const res = await customFetcher(url);

    const responseSchema = apiResponseSchema(schema);
    const parsed = responseSchema.safeParse(res);

    if (!parsed.success) {
        const errorMessages = flattenZodErrors(parsed.error);
        console.error(`❌ Zod validation failed for schema '${schema._def.description}':`, errorMessages);
        console.log(parsed.error.format());
        console.log("📦 Raw data received:", res);

        // Optionnel : propager les erreurs spécifiques
        throw new Error(`Invalid API response:\n${errorMessages}`);
    }

    if (!parsed.data.success) {
        throw new Error(parsed.data.message || "API error");
    }

    return parsed.data.data;
}