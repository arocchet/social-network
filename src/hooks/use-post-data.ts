// hooks/useUser.ts - Hook pour récupérer les infos utilisateur
'use client';

import { Post } from '@/lib/types/types';
// import { PublicUserInfo } from '@/lib/validations/userValidation';
import { useState, useEffect } from 'react';

// interface UseUserReturn {
//     user: PublicUserInfo | null;
//     loading: boolean;
//     error: string | null;
//     refetch: () => void;
// }

export function useAllPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/private/post/getAllPosts', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch posts');
            }

            const data = await response.json();

            const allPosts = data.user || [];
            console.log("ALLPOST", allPosts)

            // S'assurer que data est un tableau
            setPosts(Array.isArray(allPosts) ? allPosts : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    return {
        posts,
        loading,
        error,
        refetch: fetchAllPosts,
    };
}