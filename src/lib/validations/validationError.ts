export class ValidationError extends Error {
    fieldErrors: Record<string, string>;

    constructor(fieldErrors: Record<string, string>) {
        super("Invalid data");
        this.name = "ValidationError";
        this.fieldErrors = fieldErrors;
    }
}