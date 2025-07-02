import { z } from "zod";

export const UseUserStoriesParamsSchema = z.object({
    userId: z.string().optional(),
    publicOnly: z.coerce.boolean().optional().default(false),
    includeExpired: z.coerce.boolean().optional().default(false),
}).describe('UseUserStoriesParamsSchema');

export type UseUserStoriesParams = z.infer<typeof UseUserStoriesParamsSchema>;
