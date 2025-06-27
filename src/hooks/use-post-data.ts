'use client';
import useSWR from "swr";
import { swrFetcher } from "@/lib/server/api/swrFetcher";
import { z } from "zod";
import { PostSchemas } from "@/lib/schemas/post";

const PostsArraySchema = z.array(PostSchemas.full);

export function useAllPosts() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/private/post/getAllPosts",
        (url) => swrFetcher(url, PostsArraySchema)
    );

    return {
        posts: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}