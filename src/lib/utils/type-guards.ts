export function isFile(value: unknown): value is File {
    return typeof File !== "undefined" && value instanceof File;
}