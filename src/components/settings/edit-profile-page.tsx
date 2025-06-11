"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera } from "lucide-react"

interface EditProfilePageProps {
  onBack?: () => void
}

export function EditProfilePage({ onBack }: EditProfilePageProps) {
  const [formData, setFormData] = useState({
    name: "Alice Martin",
    username: "alice_photo",
    website: "www.alicemartin.photo",
    bio: "📸 Photographe passionnée\n🌍 Voyageuse dans l'âme\n✨ Capturer la beauté du quotidien\n📍 Paris, France",
    email: "alice@example.com",
    phone: "+33 6 12 34 56 78",
    gender: "Femme",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg">Modifier le profil</h1>
      </header>

      <div className="p-4 space-y-6  max-w-3xl mx-auto">
        {/* Photo de profil */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-1 border-[var(--detailMinimal)] ">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>AM</AvatarFallback>
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
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Nom</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nom"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"

            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Nom d'utilisateur</label>
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Nom d'utilisateur"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"

            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Site web</label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="Site web"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"

            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Présentation</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Présentation"
              rows={4}
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"

            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">E-mail</label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="E-mail"
              type="email"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"

            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Téléphone</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Téléphone"
              type="tel"
              className="border-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--textNeutral)] mb-1 block">Genre</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full p-2 border-1 border-[var(--detailMinimal)] rounded-md bg-[var(--bgLevel2)] text-[var(--textMinimal)]"
            >
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
              <option value="Personnalisé">Personnalisé</option>
              <option value="Préfère ne pas dire">Préfère ne pas dire</option>
            </select>
          </div>
        </div>

        <Button className="w-full">Enregistrer</Button>
      </div>
    </div>
  )
}
