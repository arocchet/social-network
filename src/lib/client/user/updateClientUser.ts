import { fetcher } from "@/lib/api/fetcher";

export async function updateUserClient(user: Record<string, any>) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(user)) {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    }

    try {
        const result = await fetcher<void>("/api/private/user", {
            method: "PUT",
            body: formData,
        });

        return result;
    } catch (error) {
        throw new Error(`Client error: ${(error instanceof Error) ? error.message : "Unknown error"}`);
    }
}