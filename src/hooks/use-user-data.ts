import { swrFetcher } from "@/lib/api/swrFetcher";
import { UserPublic } from "@/lib/schemas/user/public";
import useSWR from "swr";

export function useUser() {
    const { data, error, isLoading, mutate } = useSWR<UserPublic>("/api/private/user", swrFetcher);

    return {
        user: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}