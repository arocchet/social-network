import { z } from "zod";
import { fetcher as customFetcher } from "./fetcher";
import { apiResponseSchema } from "../schemas/api";

export async function swrFetcher<T>(url: string, schema: z.ZodType<T>) {
    const res = await customFetcher(url);

    const responseSchema = apiResponseSchema(schema);

    const parsed = responseSchema.safeParse(res);
    if (!parsed.success) {
        console.error("❌ Zod validation failed:");
        console.dir(parsed.error.format(), { depth: null });
        console.log("📦 Raw data received:", res);

        throw new Error("Invalid API response");
    }


    if (!parsed.data.success) {
        throw new Error(parsed.data.message || "API error");
    }

    return parsed.data.data;
}