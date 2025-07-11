import { cloudinaryService } from "../cloudinary/cloudinary"
import { disableUpload, fallbackAvatarUrl, fallbackCoverUrl } from "./config"

export async function handleUploads(formData: FormData, userId: string) {
    const avatarFile = formData.get('avatar') as File | null
    const coverFile = formData.get('cover') as File | null

    let avatarUrl = fallbackAvatarUrl
    let bannerUrl = fallbackCoverUrl

    let coverId = null
    let bannerId = null

    if (!disableUpload && avatarFile) {
        const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(avatarBuffer, {
            format: userId,
            filename: avatarFile.name
        })
        avatarUrl = upload?.secure_url ?? fallbackAvatarUrl
        coverId = upload.public_id
    }

    if (!disableUpload && coverFile) {
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(coverBuffer, {
            format: userId,
            filename: coverFile.name
        })
        bannerUrl = upload?.secure_url ?? fallbackCoverUrl
        bannerId = upload.public_id
    }

    return { avatarUrl, bannerUrl, coverId, bannerId }
}