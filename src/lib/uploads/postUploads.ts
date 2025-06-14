import { cloudinaryService } from "../cloudinary/cloudinary"
import { disableUpload, fallbackAvatarUrl } from "./config"

export async function handleImagePostUploads(image: File | null, userId: string) {
    let postImageUrl = fallbackAvatarUrl

    if (!disableUpload && image) {
        const avatarBuffer = Buffer.from(await image.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(avatarBuffer, {
            format: userId,
            filename: image.name
        })
        postImageUrl = upload?.secure_url ?? fallbackAvatarUrl
    }

    return { postImageUrl }
}