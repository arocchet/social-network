import cuid from "cuid"
import { RegisterUserInput } from "../types/types"

export async function parseRegisterFormData(formData: FormData): Promise<RegisterUserInput> {
    const userId = cuid()

    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstname') as string
    const lastName = formData.get('lastname') as string
    const birthDateStr = formData.get('dateOfBirth') as string
    const birthDate = birthDateStr ? new Date(birthDateStr) : undefined

    return {
        id: userId,
        email,
        username,
        password,
        firstName,
        lastName,
        birthDate,
        source: 'credentials',
    }
}