import { z } from "zod";
import { db } from "../..";

const inputSchema = z.object({
  type: z.enum(["LIKE", "DISLIKE"]),
  storyId: z.string().cuid(),
});

export async function updateStoryReaction(userId: string, data: unknown) {
  const result = inputSchema.safeParse(data);

  if (!result.success) {
    throw new Error("invalid body");
  }
  const updates = { ...result.data };
  await db.reaction.upsert({
    where: { userId_storyId: { userId: userId, storyId: updates.storyId } },
    update: updates,
    create: {
      userId,
      ...updates,
    },
  });
}
