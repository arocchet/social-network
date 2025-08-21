"use client"

import { useUserForm } from "@/app/context/user-register-form-context";
import { FaImage } from "react-icons/fa6";


export function ProfileBg() {
    const { userInfo, inputRefs, handleThumbnailClick, handleFileChange } = useUserForm()
    const banner = userInfo.banner
    const currentImage = banner && banner.previewUrl || ""

    return (
        <div className="h-32">
            <div className="relative border-[var(--detailMinimal)] border-1 rounded-2xl flex h-full w-full items-center justify-center overflow-hidden bg-[var(--bgLevel2)] cursor-pointer" onClick={() => handleThumbnailClick("banner")}>
                {currentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className="h-full w-full object-cover cursor-pointer"
                        src={currentImage}
                        onClick={() => handleThumbnailClick("banner")}
                        alt="banner"
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
                ref={inputRefs.banner}
                onChange={(e) => handleFileChange("banner", e)}
                className="hidden"
                accept="image/*"
                aria-label="Upload image file"
            />
        </div>
    );
}