'use client';
import { swrFetcher } from '@/lib/api/swrFetcher';
import { Post } from '@/lib/types/post';
import useSWR from 'swr';

export function useAllPosts() {
    const { data, error, isLoading, mutate } = useSWR<Post[]>("/api/private/post/getAllPosts", swrFetcher);
    console.log('data: ', data)
    return {
        posts: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}