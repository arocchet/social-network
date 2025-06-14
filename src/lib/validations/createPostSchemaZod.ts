import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PostSchema = z.strictObject({
    content: z.string().min(1, "Content is required"),
    image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Image must be less than 5MB.",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Unsupported image format. Allowed: JPEG, PNG, WEBP.",
        })
        .optional(),
});