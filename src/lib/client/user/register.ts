import type { RegisterUserFormData } from "@/lib/schemas/user/auth";


export async function register(data: RegisterUserFormData) {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("password", data.password);
    formData.append("email", data.email);

    if (data.avatar?.file) {
        formData.append("avatar", data.avatar.file);
    }
    if (data.banner?.file) {
        formData.append("banner", data.banner.file);
    }
    if (data.biography) {
        formData.append("biography", data.biography);
    }

    const res = await fetch("/api/public/auth/register", {
        method: "POST",
        body: formData,
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