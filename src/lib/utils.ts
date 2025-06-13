import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUsername(email: string): string {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

interface FormStep {
  id: string
  question: string
  placeholder: string
  type: string
  value: string
}

export function getGreetingMessage(step: FormStep) {
  if (!step.value.trim()) return null
  switch (step.id) {
    case "name":
      return `Hi ${step.value} 👋`
    case "email":
      return `We'll reach you at ${step.value}.`
    case "company":
      return `Nice to know you're working at ${step.value}.`
    default:
      return null
  }
}