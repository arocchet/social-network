
// hooks/useUserPosts.ts
'use client';

import { PostWithDetails } from '@/lib/server/post/getPost';
import { useState, useEffect, useCallback } from 'react';

interface UseUserPostsParams {
    userId?: string; // Si non fourni, utilise l'utilisateur connecté
    publicOnly?: boolean;
    page?: number;
    limit?: number;
}

interface UseUserPostsReturn {
    posts: PostWithDetails[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    total: number;
    refetch: () => void;
    loadMore: () => void;
}

export function useUserPosts({
    userId,
    publicOnly = false,
    page = 1,
    limit = 10
}: UseUserPostsParams = {}): UseUserPostsReturn {
    const [posts, setPosts] = useState<PostWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);

    const fetchPosts = useCallback(async (pageToFetch: number = 1, append: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: pageToFetch.toString(),
                limit: limit.toString(),
                publicOnly: publicOnly.toString(),
            });

            if (userId) {
                params.append('userId', userId);
            }

            const response = await fetch(`/api/private/post`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch posts');
            }

            const data = await response.json();

            const userPosts = data.user || [];

            if (append) {
                setPosts(prev => [...prev, ...userPosts]);
            } else {
                setPosts(userPosts);
            }

            setHasMore(data.pagination?.hasMore || false);
            setTotal(data.pagination?.total || userPosts.length);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [userId, publicOnly, limit]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPosts(nextPage, true);
        }
    }, [loading, hasMore, currentPage, fetchPosts]);

    const refetch = useCallback(() => {
        setCurrentPage(1);
        fetchPosts(1, false);
    }, [fetchPosts]);

    useEffect(() => {
        fetchPosts(1, false);
    }, [fetchPosts]);

    return {
        posts,
        loading,
        error,
        hasMore,
        total,
        refetch,
        loadMore,
    };
}
