import { z } from "zod";
import { OnboardingUserSchema } from "@/lib/validations/userValidation";

export type OnboardingUser = z.infer<typeof OnboardingUserSchema>;