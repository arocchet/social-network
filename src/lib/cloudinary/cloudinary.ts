import { v2 as cloudinary, UploadApiOptions, UploadApiResponse, UrlOptions } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
class CloudinaryService {
    async uploadImage(fileBuffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
        const folder = `users/${options.format}`
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: options.filename,
                    resource_type: 'image' // Explicite pour les images
                },
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result!)
                }
            )
            Readable.from(fileBuffer).pipe(stream)
        })
    }

    async uploadVideo(fileBuffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
        const folder = `users/${options.format}`
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: options.filename,
                    resource_type: 'video', // OBLIGATOIRE pour les vidéos
                    format: 'mp4', // Format de sortie souhaité
                    quality: 'auto', // Optimisation automatique
                    fetch_format: 'auto' // Format adaptatif
                },
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result!)
                }
            )
            Readable.from(fileBuffer).pipe(stream)
        })
    }

    async deleteImage(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error)
                if (result.result !== 'ok' && result.result !== 'not found') {
                    return reject(new Error(`Failed to delete image: ${result.result}`))
                }
                resolve()
            })
        })
    }

    getImageUrl(publicId: string, options?: UrlOptions): string {
        return cloudinary.url(publicId, {
            secure: true,
            ...options,
        })
    }
}

export const cloudinaryService = new CloudinaryService()