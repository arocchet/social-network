import { APIResponse } from "../../schemas/api";

type FetchOptions = Omit<RequestInit, "body" | "headers"> & {
    body?: Record<string, any> | FormData;
    headers?: Record<string, string>;
    timeout?: number;
}



export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<APIResponse<T>> {
    const { body, headers: customHeaders, timeout, ...restOptions } = options;
    const headers: Record<string, string> = { ...customHeaders };
    let bodyToSend: BodyInit | null = null;

    if (body instanceof FormData) {
        bodyToSend = body;
    } else if (body) {
        bodyToSend = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    try {
        const res = await fetch(url, {
            ...restOptions,
            body: bodyToSend,
            headers,
            signal: controller.signal,
        });

        if (timeoutId) clearTimeout(timeoutId);

        const contentType = res.headers.get("Content-Type") || "";
        const isJson = contentType.includes("application/json");

        const payload = isJson ? await res.json().catch(() => ({})) : null;

        if (!res.ok) {
            return {
                success: false,
                data: null,
                message: payload?.message || `Request failed with status ${res.status}`,
            };
        }

        return payload as APIResponse<T>;
    } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === "AbortError") {
            return {
                success: false,
                data: null,
                message: "Request timed out",
            };
        }
        return {
            success: false,
            data: null,
            message: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
