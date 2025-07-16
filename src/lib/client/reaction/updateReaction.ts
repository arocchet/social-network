import { fetcher } from "@/lib/server/api/fetcher";

export async function UpdatedReaction(data: Record<string, any>) {
    try {
        const response = await fetcher<void>("api/private/reaction", {
            method: "PUT",
            body: data,
        });
        return response;
    } catch (error) {
        if (error instanceof Error)
            throw new Error(`failed to update reaction: ${error.message}`);
        else throw new Error("Unknown error while updating reaction");
    }
}

export async function DeleteReaction(id: string) {
    try {
        const response = await fetcher<void>(`api/private/reaction/${id}`, {
            method: "DELETE",
        });
        return response;
    } catch (error) {
        if (error instanceof Error)
            throw new Error(`failed to delete reaction: ${error.message}`);
        else throw new Error("Unknown error while deleting reaction");
    }
}
