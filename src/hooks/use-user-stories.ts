"use client";

import { swrFetcher } from "@/lib/server/api/swrFetcher";
import { UserStoriesGroupSchema } from "@/lib/schemas/stories/group";
import useSWR from "swr";
import { z } from "zod";

interface UseUserStoriesParams {
  userId?: string;
  publicOnly?: boolean;
  includeExpired?: boolean;
}

const StoriesArraySchema = z
  .array(UserStoriesGroupSchema)
  .describe("StoriesArraySchema");

export function useUserStories({
  userId,
  publicOnly = false,
  includeExpired = false,
}: UseUserStoriesParams = {}) {
  const params = new URLSearchParams();
  if (publicOnly) params.append("publicOnly", "true");
  if (includeExpired) params.append("includeExpired", "true");
  if (userId) params.append("userId", userId);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/private/stories?${params.toString()}`,
    (url) => swrFetcher(url, StoriesArraySchema)
  );

  return {
    storiesGroups: data,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
