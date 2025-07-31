import { z } from "zod";
import { Visibility } from "@prisma/client";

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

export const CreatePostSchema = z
  .object({
    content: z.string().min(1, "Content is required"),
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
    visibility: z.nativeEnum(Visibility).default(Visibility.PUBLIC),
  })
  .describe("CreatePostSchema");

export type CreatePost = z.infer<typeof CreatePostSchema>;
