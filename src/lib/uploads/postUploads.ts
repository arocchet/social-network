import { cloudinaryService } from "../cloudinary/cloudinary"
import { disableUpload, fallbackAvatarUrl } from "./config"

export async function handleImagePostUploads(image: File | null, userId: string) {
    let postImageUrl = fallbackAvatarUrl
    let postImageId = null

    if (!disableUpload && image) {
        const avatarBuffer = Buffer.from(await image.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(avatarBuffer, {
            format: userId,
            filename: image.name
        })
        postImageUrl = upload?.secure_url ?? fallbackAvatarUrl
        postImageId = upload.public_id
    }

    return { postImageUrl, postImageId }
}

export async function handleVideoPostUploads(video: File | null, userId: string) {
    let postVideoUrl = fallbackAvatarUrl
    let postVideoId = null


    if (!disableUpload && video) {
        const avatarBuffer = Buffer.from(await video.arrayBuffer())
        const upload = await cloudinaryService.uploadVideo(avatarBuffer, {
            format: userId,
            filename: video.name
        })
        postVideoUrl = upload?.secure_url ?? fallbackAvatarUrl
        postVideoId = upload.public_id
    }

    return { postVideoUrl, postVideoId }
}
