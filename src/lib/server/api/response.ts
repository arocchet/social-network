import { APIResponse } from "@/lib/schemas/api";

export function respondSuccess<T>(data: T, message?: string): APIResponse<T> {
    return { success: true, data, message };
}

export function respondError(message: string, fieldErrors?: Record<string, string>): APIResponse<null> {
    return { success: false, data: null, message, fieldErrors };
}
