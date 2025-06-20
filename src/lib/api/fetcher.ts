type FetchOptions = Omit<RequestInit, "body" | "headers"> & {
    body?: Record<string, any> | FormData;
    headers?: Record<string, string>;
    timeout?: number;
}

type FetchResponse<T> = {
    data: T | null;
    error: string | null;
    fieldErrors?: Record<string, string>;
    status: number;
}

export async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<FetchResponse<T>> {
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
                data: null,
                error: payload?.message || `Request failed with status ${res.status}`,
                fieldErrors: payload?.fieldErrors || null,
                status: res.status,
            };
        }

        return {
            data: payload as T,
            error: null,
            status: res.status,
        };
    } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === "AbortError") {
            return {
                data: null,
                error: "Request timed out",
                status: 0,
            };
        }
        return {
            data: null,
            error: err instanceof Error ? err.message : "Unknown error",
            status: 0,
        };
    }
}
