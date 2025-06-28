'use client';

import { swrFetcher } from '@/lib/api/swrFetcher';
import { StorySchemas } from '@/lib/schemas/stories';
import { UserStoriesGroup, UserStoriesGroupSchema } from '@/lib/schemas/stories/group';
import useSWR from 'swr';
import { z } from 'zod';

// export interface StoryWithDetails {
//     id: string;
//     media: string;
//     datetime: string;
//     visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
//     user: {
//         id: string;
//         username: string;
//         firstName: string;
//         lastName: string;
//         avatar: string;
//     };
//     reactions: Array<{
//         id: string;
//         type: 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';
//         user: {
//             id: string;
//             username: string;
//         };
//     }>;
// }

// export interface UserStoriesGroup {
//     user: {
//         id: string;
//         username: string;
//         firstName: string;
//         lastName: string;
//         avatar: string;
//     };
//     stories: StoryWithDetails[];
//     hasUnviewed: boolean;
// }

interface UseUserStoriesParams {
    userId?: string;
    publicOnly?: boolean;
    includeExpired?: boolean;
}

// interface UseUserStoriesReturn {
//     storiesGroups: UserStoriesGroup[];
//     loading: boolean;
//     error: string | null;
//     refetch: () => void;
// }


const StoriesArraySchema = z.array(UserStoriesGroupSchema);


export function useUserStories({
    userId,
    publicOnly = false,
    includeExpired = false
}: UseUserStoriesParams = {}) {
    const params = new URLSearchParams();
    if (publicOnly) params.append('publicOnly', 'true');
    if (includeExpired) params.append('includeExpired', 'true');
    if (userId) params.append('userId', userId);

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