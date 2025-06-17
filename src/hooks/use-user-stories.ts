// hooks/useUserStories.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface StoryWithDetails {
    id: string;
    media: string;
    datetime: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
    reactions: Array<{
        id: string;
        type: 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';
        user: {
            id: string;
            username: string;
        };
    }>;
}

export interface UserStoriesGroup {
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
    stories: StoryWithDetails[];
    hasUnviewed: boolean;
}

interface UseUserStoriesParams {
    userId?: string; // Si non fourni, récupère toutes les stories visibles
    publicOnly?: boolean;
    includeExpired?: boolean; // Stories de plus de 24h
}

interface UseUserStoriesReturn {
    storiesGroups: UserStoriesGroup[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useUserStories({
    userId,
    publicOnly = false,
    includeExpired = false
}: UseUserStoriesParams = {}): UseUserStoriesReturn {
    const [storiesGroups, setStoriesGroups] = useState<UserStoriesGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                publicOnly: publicOnly.toString(),
                includeExpired: includeExpired.toString(),
            });

            if (userId) {
                params.append('userId', userId);
            }

            const response = await fetch(`/api/private/stories?${params}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch stories');
            }

            const data = await response.json();

            setStoriesGroups(data.storiesGroups || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [userId, publicOnly, includeExpired]);

    const refetch = useCallback(() => {
        fetchStories();
    }, [fetchStories]);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    return {
        storiesGroups,
        loading,
        error,
        refetch,
    };
}