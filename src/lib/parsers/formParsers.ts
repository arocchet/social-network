import { CreatePost } from "@/lib/schemas/post/create"
import { CreateStory } from "@/lib/schemas/stories/create"
import cuid from "cuid"
import { RegisterUserInput } from "../schemas/user/auth"

export function parseCreateComment(formData: FormData): CreatePost {

    const content = formData.get('content') as string
    // const media = formData.get('media') as File
    return {
        content,
        // media
    }
}

export function parseCreatePost(formData: FormData): CreatePost {

    const content = formData.get('content') as string
    const media = formData.get('media') as File
    return {
        content,
        media

    }
}

export function parseCreateStory(formData: FormData): CreateStory {

    const media = formData.get('media') as File
    return {
        media
    }
}

export async function mapRegisterFormToInput(formData: FormData): Promise<RegisterUserInput> {
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