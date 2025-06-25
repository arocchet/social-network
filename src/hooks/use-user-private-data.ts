import { swrFetcher } from "@/lib/api/swrFetcher";
import { UserPrivateSchema } from "@/lib/schemas/user/private";
import useSWR from "swr";

export function useUserPrivate() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/private/me",
        (url) => swrFetcher(url, UserPrivateSchema)
    );

    return {
        user: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}