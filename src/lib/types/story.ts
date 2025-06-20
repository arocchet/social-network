import { z } from "zod";
import { StorySchema } from "@/lib/validations/createStorySchemaZod";

export type CreateStoryForm = z.infer<typeof StorySchema>;