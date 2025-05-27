import { useUserForm } from "@/app/context/user-register-form-context";
import { FaImage } from "react-icons/fa6";


export function Avatar() {
    const { imageData, handleThumbnailClick, handleFileChange } = useUserForm()
    const avatar = imageData.avatar
    const currentImage = avatar.previewUrl || ""

    return (
        <div className=" px-6">
            <div className="relative flex size-20  border-4 items-center justify-center cursor-pointer overflow-hidden rounded-full bg-muted shadow-sm shadow-black/10" onClick={() => handleThumbnailClick("avatar")}>
                {currentImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={currentImage}
                        className="h-full w-full object-cover cursor-pointer"
                        width={80}
                        height={80}
                        alt="Profile image"
                    />
                ) : (
                    <div className="w-full bg-muted h-40 justify-center flex items-center">
                        <FaImage className="text-neutral-300" size={30} />
                    </div>
                )}

                <input
                    type="file"
                    ref={avatar.fileInputRef}
                    onChange={(e) => handleFileChange("avatar", e)}
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload profile picture"
                />
            </div>

        </div>
    );
}

export default Avatar