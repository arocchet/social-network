import { db } from "@/lib/db";
import { PostWithDetails } from "@/lib/schemas/post";
import { serializeDates } from "@/lib/utils/serializeDates";
import { getUserPosts } from "@/lib/db/queries/post/getAllPosts";

export async function getPostsByUserIdServer(
  userId: string,
  currentUserId?: string
): Promise<PostWithDetails[]> {
  try {
    const posts = await getUserPosts(userId, 0, 50, currentUserId);
    return serializeDates(posts);
  } catch (error) {
    console.error("Database error in getPostsByUserIdServer:", error);
    throw new Error("Failed to fetch user posts");
  }
}
