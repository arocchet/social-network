import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

type ImageKey = "avatar" | "cover" // Ajoute d'autres clés ici si nécessaire


type UserFormContextType = {
    username: string
    setUsername: (val: string) => void
    firstname: string
    setFirstname: (val: string) => void
    lasttname: string
    setLasttname: (val: string) => void
    dateOfBirth: string
    setdateOfBirth: (val: string) => void
    biography: string
    setBiography: (val: string) => void
    imageData: Record<ImageKey, ImageData>
    handleThumbnailClick: (key: ImageKey) => void
    handleFileChange: (key: ImageKey, e: React.ChangeEvent<HTMLInputElement>) => void
    handleRemove: (key: ImageKey) => void
}

type ImageData = {
    previewUrl: string | null
    fileName: string | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
}

const UserFormContext = createContext<UserFormContextType | undefined>(undefined)

export const UserFormProvider = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lasttname, setLasttname] = useState("")
    const [dateOfBirth, setdateOfBirth] = useState("")
    const [biography, setBiography] = useState("")

    const initialImageState = (): ImageData => ({
        previewUrl: null,
        fileName: null,
        fileInputRef: useRef(null),
    })

    const [imageData, setImageData] = useState<Record<ImageKey, ImageData>>({
        avatar: initialImageState(),
        cover: initialImageState(),
    })

    const handleThumbnailClick = (key: ImageKey) => {
        imageData[key].fileInputRef.current?.click()
    }


    const handleFileChange = (key: ImageKey, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImageData(prev => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        previewUrl: reader.result as string,
                        fileName: file.name,
                    },
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemove = useCallback((key: ImageKey) => {
        const preview = imageData[key].previewUrl
        if (preview) {
            URL.revokeObjectURL(preview)
        }

        setImageData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                previewUrl: null,
                fileName: null,
            },
        }))

        const inputRef = imageData[key].fileInputRef.current
        if (inputRef) inputRef.value = ""
    }, [imageData])

    // Nettoyage des previews à l’unmount
    useEffect(() => {
        return () => {
            Object.values(imageData).forEach(data => {
                if (data.previewUrl) {
                    URL.revokeObjectURL(data.previewUrl)
                }
            })
        }
    }, [imageData])


    return (
        <UserFormContext.Provider
            value={{
                biography,
                setBiography,
                dateOfBirth,
                setdateOfBirth,
                lasttname,
                setLasttname,
                username,
                setUsername,
                firstname,
                setFirstname,
                imageData,
                handleThumbnailClick,
                handleFileChange,
                handleRemove,
            }}
        >
            {children}
        </UserFormContext.Provider>
    )
}

export const useUserForm = () => {
    const context = useContext(UserFormContext)
    if (!context) {
        throw new Error("useUserForm must be used within a UserFormProvider")
    }
    return context
}
