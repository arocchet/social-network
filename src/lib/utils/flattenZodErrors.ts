import { ZodError } from "zod";

export function flattenZodErrors(error: ZodError): string {
    const lines: string[] = [];

    const formatPath = (path: (string | number)[]) =>
        path.map((seg) => (typeof seg === "number" ? `[${seg}]` : `.${seg}`)).join("");

    for (const issue of error.errors) {
        const { path, message } = issue;
        const pathStr = formatPath(path).replace(/^\./, '');
        lines.push(`${pathStr} : ${message}`);
    }

    return lines.join("\n");
}