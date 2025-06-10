import { cloudinaryService } from "../cloudinary/cloudinary"

const disableUpload = process.env.NODE_ENV === 'test'
const fallbackAvatarUrl = 'https://media.discordapp.net/attachments/1357283554769502361/1376852929633325096/image.png?ex=68401037&is=683ebeb7&hm=ce23ac84db91474439ac5b722376061c96ca64c6c15f03af6ae70665cea3aad8&=&format=webp&quality=lossless'
const fallbackCoverUrl = 'https://cdn.discordapp.com/attachments/1357283554769502361/1376847788372918342/konekt-high-resolution-logo.png?ex=68400b6d&is=683eb9ed&hm=74cdd867140f37dc46cc82122413067510c5a262a757fa0e96d53ab277427008&'

export async function handleUploads(formData: FormData, userId: string) {
    const avatarFile = formData.get('avatar') as File | null
    const coverFile = formData.get('cover') as File | null

    let avatarUrl = fallbackAvatarUrl
    let bannerUrl = fallbackCoverUrl

    if (!disableUpload && avatarFile) {
        const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(avatarBuffer, {
            format: userId,
            filename: avatarFile.name
        })
        avatarUrl = upload?.secure_url ?? fallbackAvatarUrl
    }

    if (!disableUpload && coverFile) {
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer())
        const upload = await cloudinaryService.uploadImage(coverBuffer, {
            format: userId,
            filename: coverFile.name
        })
        bannerUrl = upload?.secure_url ?? fallbackCoverUrl
    }

    return { avatarUrl, bannerUrl }
}