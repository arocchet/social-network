export async function updateUserClient(user: Record<string, string>) {
    try {
        const res = await fetch("/api/private/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!res.ok) {
            let errorMessage = "Failed update user's informations.";
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (err) {
                console.warn("Failed to parse error response as JSON:", err);
            }

            throw new Error(errorMessage);
        }

        return await res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Client error : ${error.message}`);
        }

        throw new Error("Unknow Error");
    }
}