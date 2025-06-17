// hooks/usePostById.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PostWithDetails {
    id: string;
    content: string;
    media: string | null;
    datetime: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
    user: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
    comments: Array<{
        id: string;
        content: string;
        datetime: string;
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    }>;
    reactions: Array<{
        id: string;
        type: 'LIKE' | 'DISLIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY';
        user: {
            id: string;
            username: string;
        };
    }>;
}

interface UsePostByIdParams {
    postId: string;
}

interface UsePostByIdReturn {
    post: PostWithDetails | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function usePostById({ postId }: UsePostByIdParams): UsePostByIdReturn {
    const [post, setPost] = useState<PostWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        if (!postId) {
            setError('Post ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/private/post/${postId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Post introuvable');
                }
                if (response.status === 401) {
                    throw new Error('Vous devez être connecté pour voir ce post');
                }
                if (response.status === 403) {
                    throw new Error('Vous n\'avez pas accès à ce post');
                }

                const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
                throw new Error(errorData.message || `Erreur ${response.status}`);
            }

            const data = await response.json();

            console.log(data)

            // Validation des données reçues
            if (!data || typeof data !== 'object') {
                throw new Error('Données invalides reçues du serveur');
            }

            setPost(data);
        } catch (err) {
            console.error('Erreur lors de la récupération du post:', err);
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            setPost(null);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const refetch = useCallback(() => {
        if (postId) {
            fetchPost();
        }
    }, [fetchPost, postId]);

    useEffect(() => {
        if (postId) {
            fetchPost();
        } else {
            setLoading(false);
            setError('ID du post manquant');
        }
    }, [fetchPost, postId]);

    return {
        post,
        loading,
        error,
        refetch,
    };
}