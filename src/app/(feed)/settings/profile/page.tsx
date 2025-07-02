import dynamic from "next/dynamic"

const EditProfilePage = dynamic(() => import("@/components/settings/edit-profile-page"), {})

export default function SettingsProfilePage() {
    return <EditProfilePage />
}