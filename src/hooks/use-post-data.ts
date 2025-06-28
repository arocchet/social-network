import useSWRInfinite from 'swr/infinite';
import { swrFetcher } from '@/lib/server/api/swrFetcher';
import { z } from 'zod';
import { PostSchemas } from '@/lib/schemas/post';
import { useMemo } from 'react';

const PostsArraySchema = z.array(PostSchemas.full);

const PAGE_SIZE = 7;

export function useInfinitePosts() {
    const getKey = (pageIndex: number, previousPageData: unknown) => {
        if (previousPageData && (previousPageData as any).length === 0) return null;
        return `/api/private/post/getAllPosts?skip=${pageIndex * PAGE_SIZE}&take=${PAGE_SIZE}`;
    };

    const {
        data,
        error,
        size,
        setSize,
        isValidating,
    } = useSWRInfinite(getKey, (url) => swrFetcher(url, PostsArraySchema));

    const posts = useMemo(() => (data ? data.flat() : []), [data]);
    const isLoadingInitialData = !data && !error;
    const loading =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const hasMore = !isEmpty && (data?.[size - 1]?.length ?? 0) === PAGE_SIZE;

    return {
        posts,
        error,
        loading,
        isValidating,
        loadMore: () => setSize(size + 1),
        hasMore,
    };
}