import { CreateCommentForm, CreatePostForm } from "@/lib/types/types"

export function parseCreateComment(formData: FormData): CreateCommentForm {

    const content = formData.get('content') as string
    // const media = formData.get('media') as File
    return {
        content,
        // media
    }
}