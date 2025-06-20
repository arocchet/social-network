export type FormStep = {
    editable: boolean;
    id: string;
    placeholder: string;
    question: string;
    type: "text" | "email" | "date" | "textarea" | "select" | "password";
    value: string;
    visible?: boolean;
};