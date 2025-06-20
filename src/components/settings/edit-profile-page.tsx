"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera } from "lucide-react"
import { useUserContext } from "@/app/context/user-context"
import { UserInfoProfile } from "@/lib/types/types"
import EditProfileSkeleton from "../skeletons/EditProfileSkeleton"
import { updateUserClient } from "@/lib/client/user/updateClientUser"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserEditable, UserEditableSchema } from "@/lib/validations/user"

function EditProfilePage() {
  const { user } = useUserContext()
  const router = useRouter();
  const [formData, setFormData] = useState<UserEditable | null>(null)


  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.username || "",
        avatar: user.avatar || null,
        banner: user.banner || null,
        biography: user.biography || "",
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        birthDate: typeof user.birthDate === "string" ? user.birthDate.split("T")[0] : "",
      })
    }
  }, [user])


  const handleInputChange = (field: keyof UserInfoProfile, value: string) => {
    if (!formData) return
    setFormData((prev) => prev && { ...prev, [field]: value })
  }

  const handleRedirectClick = () => {
    router.back()
  }

  const handleSubmit = async () => {
    const result = UserEditableSchema.safeParse(formData);

    if (!result.success) {
      const [_, firstMessage] = Object.entries(result.error.errors)[0];
      toast.error(`${firstMessage.message}`);
      return;
    }

    const values = formData as Record<string, any>;

    const response = await updateUserClient(values);
    if (response.error) {
      if (response.fieldErrors) {
        const [firstField, firstMessage] = Object.entries(response.fieldErrors)[0];
        toast.error(`${firstField}: ${firstMessage}`);
      } else {
        toast.error(response.error);
      }
      return;
    }

    toast.success("Your information has been updated successfully.");
  };

  if (!formData) return <EditProfileSkeleton />


  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={handleRedirectClick}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg">Modifier le profil</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Photo de profil */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-1 border-[var(--detailMinimal)]">
              <AvatarImage src={formData.avatar ?? undefined} alt="Profile" />
              <AvatarFallback>
                {formData.firstName?.[0]?.toUpperCase()}
                {formData.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="link" className="text-blue-600">
            Modifier la photo de profil
          </Button>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Prénom</label>
            <Input
              value={formData.firstName ?? ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Prénom"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Nom</label>
            <Input
              value={formData.lastName ?? ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Nom"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Nom d'utilisateur</label>
            <Input
              value={formData.username ?? ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Nom d'utilisateur"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="E-mail"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Présentation</label>
            <Textarea
              value={formData.biography ?? ""}
              onChange={(e) => handleInputChange("biography", e.target.value)}
              placeholder="Présentation"
              rows={4}
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Date de naissance</label>
            <Input
              type="date"
              value={formData.birthDate ?? ""}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              placeholder="Date de naissance"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit}>Enregistrer</Button>
      </div>
    </div>
  )
}

export default EditProfilePage