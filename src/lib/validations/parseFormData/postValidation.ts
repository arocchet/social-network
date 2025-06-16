import { CreatePostForm } from "@/lib/types/types"

export function parseCreatePost(formData: FormData): CreatePostForm {

    const content = formData.get('content') as string
    const image = formData.get('img') as File | undefined

    return {
        content,
        image: image && image.size > 0 && image.name ? image : undefined

    }
}