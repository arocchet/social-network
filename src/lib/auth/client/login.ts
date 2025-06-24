import type { CredentialsLogin } from "@/lib/schemas/user/auth";

export async function login(data: CredentialsLogin) {

    const res = await fetch("/api/public/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
        if (json.errors && typeof json.errors === "object") {
            throw json.errors;
        }
        throw new Error(json.message || "Failed to register");
    }

    return json;
}