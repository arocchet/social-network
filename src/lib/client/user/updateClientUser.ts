import { fetcher } from "@/lib/server/api/fetcher";

export async function updateUserClient(user: Record<string, any>) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(user)) {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    }

    try {
        const response = await fetcher<void>("/api/private/me", {
            method: "PUT",
            body: formData,
        });

        return response;
    } catch (error) {
        throw new Error(`Client error: ${(error instanceof Error) ? error.message : "Unknown error"}`);
    }
}