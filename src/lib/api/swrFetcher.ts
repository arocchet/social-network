import { fetcher as customFetcher } from "./fetcher";

export async function swrFetcher<T>(url: string) {
    const res = await customFetcher<T>(url);
    if (res.error) {
        throw new Error(res.error);
    }
    return res.data as T;
}
