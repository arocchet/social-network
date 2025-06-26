import useSWR from "swr";
import { swrFetcher } from "@/lib/server/api/swrFetcher";
import { UserSchemas } from "@/lib/schemas/user";


export function useUser() {
    const { data, error, isLoading, mutate } = useSWR(
        "/api/private/user",
        (url) => swrFetcher(url, UserSchemas.Public)
    );

    return {
        user: data,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}