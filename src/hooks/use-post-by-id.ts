'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/server/api/swrFetcher';
import { PostSchemas } from '@/lib/schemas/post';
import { z } from 'zod';

const SinglePostsArraySchema = z.array(PostSchemas.Details);

export function usePostById(postId: string | null) {
    const shouldFetch = !!postId;

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `/api/private/post/${postId}` : null,
        (url) => swrFetcher(url, PostSchemas.Details)
    );

    return {
        post: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}