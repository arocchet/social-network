import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
];

export const CreateStorySchema = z.object({
    media: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "File must be less than 10MB.",
        })
        .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
            message:
                "Unsupported file format. Allowed: GIF, AVIF, JPEG, PNG, WEBP, MP4, WEBM, OGG, MOV.",
        }),
    visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS"]).default("PUBLIC"),
}).describe('CreateStorySchema');

export type CreateStory = z.infer<typeof CreateStorySchema>