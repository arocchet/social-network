import useSWR from "swr";
import { swrFetcher } from "@/lib/api/swrFetcher";
import { UserPublicSchema } from "@/lib/schemas/user/public";


export function useUser() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/private/user",
        (url) => swrFetcher(url, UserPublicSchema)
    );

    return {
        user: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}