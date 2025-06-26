import { FormStep, UserEditable } from "@/lib/schemas/user";


export function getFormSteps(user: UserEditable): FormStep[] {
    const allSteps: FormStep[] = [
        {
            id: "email",
            question: "You are signed as",
            placeholder: "",
            type: "email",
            value: user.email ?? "",
            editable: false,
        },
        {
            id: "firstName",
            question: "What's your first name?",
            placeholder: "Your full name",
            type: "text",
            value: user.firstName ?? "",
            editable: true,
        },
        {
            id: "lastName",
            question: "What's your last name?",
            placeholder: "Your full name",
            type: "text",
            value: user.lastName ?? "",
            editable: true,
        },
        {
            id: "username",
            question: "Pick a username",
            placeholder: "e.g. rokat.dev",
            type: "text",
            value: user.username ?? "",
            editable: true,
        },
        {
            id: "birthDate",
            question: "When were you born?",
            placeholder: "YYYY-MM-DD",
            type: "date",
            value: user.birthDate ?? "",
            editable: true,
            visible: !user.birthDate,
        },
        {
            id: "biography",
            question: "Tell us something about you",
            placeholder: "Just a short bio",
            type: "textarea",
            value: user.biography ?? "",
            editable: true,
        },
    ];

    return allSteps.filter(step => step.visible !== false);
}