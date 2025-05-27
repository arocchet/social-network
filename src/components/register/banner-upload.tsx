"use client"

import { useUserForm } from "@/app/context/user-register-form-context";
import { FaImage } from "react-icons/fa6";


export function ProfileBg() {
    const { imageData, handleThumbnailClick, handleFileChange } = useUserForm()
    const cover = imageData.cover
    const currentImage = cover.previewUrl || ""

    return (
        <div className="h-32">
            <div className="relative rounded-2xl flex h-full w-full items-center justify-center overflow-hidden bg-muted cursor-pointer" onClick={() => handleThumbnailClick("cover")}>
                {currentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className="h-full w-full object-cover cursor-pointer"
                        src={currentImage}
                        onClick={() => handleThumbnailClick("cover")}
                        alt="cover"
                        width={512}
                        height={96}
                    />
                ) : (
                    <div className="w-full bg-muted h-40 justify-center flex items-center">
                        <FaImage className="text-neutral-300" size={30} />
                    </div>
                )}

            </div>
            <input
                type="file"
                ref={cover.fileInputRef}
                onChange={(e) => handleFileChange("cover", e)}
                className="hidden"
                accept="image/*"
                aria-label="Upload image file"
            />
        </div>
    );
}