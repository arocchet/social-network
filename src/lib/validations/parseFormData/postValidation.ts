import { CreatePostForm } from "@/lib/types/types"

export function parseCreatePost(formData: FormData): CreatePostForm {

    const content = formData.get('content') as string
    const media = formData.get('media') as File
    return {
        content,
        media

    }
}