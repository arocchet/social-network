import useSWRInfinite from "swr/infinite";
import { Post } from "@/lib/schemas/post";

const PAGE_SIZE = 10;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useVideoReels() {
    const getKey = (pageIndex: number, previousPageData: unknown) => {
        if (previousPageData && (previousPageData as any).data.length === 0) return null;
        return `/api/private/post/getVideoReels?skip=${pageIndex * PAGE_SIZE}&take=${PAGE_SIZE}`;
    };

    const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateFirstPage: false,
            revalidateAll: false,
        }
    );

    const posts: Post[] = data ? data.flatMap((page) => page.data) : [];
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.data.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data.length < PAGE_SIZE);

    const loadMore = () => {
        if (!isLoadingMore && !isReachingEnd) {
            setSize(size + 1);
        }
    };

    return {
        posts,
        error,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        loadMore,
        mutate,
    };
}