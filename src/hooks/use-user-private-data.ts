import { swrFetcher } from "@/lib/api/swrFetcher";
import { UserPrivate } from "@/lib/schemas/user/private";
import useSWR from "swr";

export function useUserPrivate() {
    const { data, error, isLoading, mutate } = useSWR<UserPrivate>("/api/private/me", swrFetcher);

    return {
        user: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}