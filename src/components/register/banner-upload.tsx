"use client"

import { useUserForm } from "@/app/[locale]/context/user-register-form-context";
import { FaImage } from "react-icons/fa6";


export function ProfileBg() {
    const { userInfo, inputRefs, handleThumbnailClick, handleFileChange } = useUserForm()
    const cover = userInfo.cover
    const currentImage = cover && cover.previewUrl || ""

    return (
        <div className="h-32">
            <div className="relative border-[var(--detailMinimal)] border-1 rounded-2xl flex h-full w-full items-center justify-center overflow-hidden bg-[var(--bgLevel2)] cursor-pointer" onClick={() => handleThumbnailClick("cover")}>
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
                    <div className="w-full bg-[var(--bgLevel1)] h-40 justify-center flex items-center">
                        <FaImage className="text-neutral-300" size={30} />
                    </div>
                )}

            </div>
            <input
                type="file"
                ref={inputRefs.cover}
                onChange={(e) => handleFileChange("cover", e)}
                className="hidden"
                accept="image/*"
                aria-label="Upload image file"
            />
        </div>
    );
}