'use client';
import useSWR from "swr";
import { swrFetcher } from "@/lib/server/api/swrFetcher";
import { PostSchema } from "@/lib/schemas/post/post";
import { z } from "zod";

const PostsArraySchema = z.array(PostSchema);

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