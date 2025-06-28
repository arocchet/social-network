import { z } from "zod";
import { fetcher as customFetcher } from "./fetcher";
import { apiResponseSchema } from "../../schemas/api";
import { flattenZodErrors } from "@/lib/utils/flattenZodErrors";
import { parseOrThrow } from "../../utils/";

export async function swrFetcher<T>(url: string, schema: z.ZodType<T>) {
    const res = await customFetcher(url);

    const responseSchema = apiResponseSchema(schema);
    const parsed = parseOrThrow(responseSchema, res);

    if (!parsed.success) {
        throw new Error(parsed.message || "API error");
    }
    return parsed.data;
}