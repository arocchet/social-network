'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/server/api/swrFetcher';
import { PostSchemas } from '@/lib/schemas/post';

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