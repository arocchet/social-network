// hooks/useUser.ts - Hook pour récupérer les infos utilisateur
'use client';

import { PublicUserInfo } from '@/lib/validations/userValidation';
import { useState, useEffect } from 'react';

interface UseUserReturn {
    user: PublicUserInfo | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useUser(): UseUserReturn {
    const [user, setUser] = useState<PublicUserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/private/user', {
                method: 'GET',
                credentials: 'include', // Pour inclure les cookies
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user');
            }

            const data = await response.json();
            console.log("REFECTH", data)

            setUser(data.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
    };
}