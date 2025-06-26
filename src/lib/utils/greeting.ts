import { FormStep } from "../schemas/user/auth";

export function getGreetingMessage(step: FormStep) {
    if (!step.value || !step.value.trim()) return null;

    switch (step.id) {
        case "name":
            return `Hi ${step.value} 👋 We're glad you're here! 😊`
        case "email":
            return `📧 We'll reach you at **${step.value}**. Stay tuned!`
        case "company":
            return `🏢 Nice to know you're working at **${step.value}**. Impressive! 💼`
        case "username":
            return `😎 That's a cool username: **${step.value}**! We like it! 🚀`
        case "birthDate":
            return `🎂 Born on ${step.value}? Great things happened that day!`
        case "bio":
            return `🌟 Thanks for sharing a bit about yourself — we're excited to learn more!`
        default:
            return null
    }
}