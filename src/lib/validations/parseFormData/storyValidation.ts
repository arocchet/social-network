import { CreateStoryForm } from "@/lib/types/types"

export function parseCreateStory(formData: FormData): CreateStoryForm {

    const media = formData.get('media') as File
    return {
        media

    }
}