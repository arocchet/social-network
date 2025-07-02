import { isFile } from "../utils/";
import { cloudinaryService } from "./cloudinary";

export async function uploadIfFile(field: FormDataEntryValue | null, folder: string): Promise<{ url: string, id: string } | null> {
    if (!isFile(field)) return null;
    const buffer = Buffer.from(await field.arrayBuffer());
    const uploaded = await cloudinaryService.uploadImage(buffer, {
        folder,
        filename: field.name,
    });
    return {
        url: uploaded.secure_url,
        id: uploaded.public_id,
    };
}