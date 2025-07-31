'use client'

import { useState, useEffect } from 'react'
import { UserPublic } from '@/lib/schemas/user/public'

/**
 * Hook pour récupérer l'utilisateur connecté
 */
interface UseUserReturn {
    user: UserPublic | null
    loading: boolean
    error: string | null
    refetch: () => void
}

export function useUser(): UseUserReturn {
    const [user, setUser] = useState<UserPublic | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/private/user', {
                method: 'GET',
                credentials: 'include',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch user')
            }

            const data = await response.json()
            setUser(data.user)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
    }
}
/**
 * Hook pour récupérer un profil utilisateur (soi-même ou un autre utilisateur)
 */
interface UseUserProfileReturn {
    user: UserPublic | null
    loading: boolean
    error: string | null
    isOwnProfile: boolean
    refetch: () => void
}

export function useUserProfile(userIdFromParams?: string): UseUserProfileReturn {
    const [user, setUser] = useState<UserPublic | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOwnProfile, setIsOwnProfile] = useState(false)

    const {
        user: currentUser,
        loading: currentUserLoading,
        error: _ignoredError,
    } = useUser()

    const fetchUserProfile = async () => {
        if (!currentUser || currentUserLoading) return

        const isOwn = !userIdFromParams || userIdFromParams === currentUser.id
        setIsOwnProfile(isOwn)
        setLoading(true)
        setError(null)

        try {
            if (isOwn) {
                setUser(currentUser)
            } else {
                const response = await fetch(`/api/private/user/${userIdFromParams}`, {
                    headers: {
                        'x-user-id': currentUser.id,
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || 'Failed to fetch user')
                }

                const data = await response.json()

                console.log("DATA", data)
                setUser(data.user)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!currentUserLoading && currentUser) {
            fetchUserProfile()
        }
    }, [userIdFromParams, currentUserLoading, currentUser])


    return {
        user,
        loading: loading || currentUserLoading,
        error,
        isOwnProfile,
        refetch: fetchUserProfile,
    }
}