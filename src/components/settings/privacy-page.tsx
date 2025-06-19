"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"

interface PrivacyPageProps {
  userId: string
  onBack?: () => void
}

export function PrivacyPage({ userId, onBack }: PrivacyPageProps) {
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allowFollows, setAllowFollows] = useState<'everyone' | 'approved'>('everyone')
  const [showActivityStatus, setShowActivityStatus] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/private/settings/privacy', {
          headers: {
            'x-user-id': userId,
          },
        })
        const data = await response.json()
        setIsPrivate(data.visibility === 'PRIVATE')
        setAllowFollows(data.allowFollows || 'everyone')
        setShowActivityStatus(data.showActivityStatus ?? true)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [userId])

  const saveSettings = async (updated: Partial<{ visibility: string, allowFollows: string, showActivityStatus: boolean }>) => {
    try {
      const response = await fetch('/api/private/settings/privacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(updated),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePrivacyChange = (checked: boolean) => {
    setIsPrivate(checked)
    saveSettings({ visibility: checked ? 'PRIVATE' : 'PUBLIC' })
  }

  const handleAllowFollowsChange = (value: 'everyone' | 'approved') => {
    setAllowFollows(value)
    saveSettings({ allowFollows: value })
  }

  const handleActivityStatusChange = (checked: boolean) => {
    setShowActivityStatus(checked)
    saveSettings({ showActivityStatus: checked })
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg">Confidentialité du compte</h1>
      </header>

      <div className="p-4 space-y-8 max-w-3xl mx-auto">
        {/* Compte privé */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--textMinimal)]">Compte privé</span>
            <Switch
              checked={isPrivate}
              onCheckedChange={handlePrivacyChange}
              disabled={isLoading}
            />
          </div>
          <p className="text-sm text-[var(--textNeutral)]">
            Seules les personnes que vous approuvez peuvent voir votre contenu lorsque votre compte est privé.
          </p>
        </div>

        {/* Qui peut vous suivre */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--textMinimal)]">Qui peut vous suivre</h2>
          <div className="space-y-4">
            {['everyone', 'approved'].map(value => (
              <div className="flex items-center" key={value}>
                <input
                  type="radio"
                  name="allow-follows"
                  id={`follows-${value}`}
                  value={value}
                  checked={allowFollows === value}
                  onChange={() => handleAllowFollowsChange(value as 'everyone' | 'approved')}
                  className="w-4 h-4"
                />
                <label htmlFor={`follows-${value}`} className="ml-3 text-base text-[var(--textMinimal)]">
                  {value === 'everyone' ? 'Tout le monde' : 'Seulement les abonnés approuvés'}
                </label>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--textNeutral)]">
            {allowFollows === 'everyone'
              ? "N'importe qui peut vous envoyer des demandes d'abonnement."
              : "Seuls les utilisateurs que vous approuvez peuvent vous suivre."}
          </p>
        </div>

        {/* Statut d'activité */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--textMinimal)]">
              Afficher le statut d'activité
            </span>
            <Switch
              checked={showActivityStatus}
              onCheckedChange={handleActivityStatusChange}
              disabled={isLoading}
            />
          </div>
          <p className="text-sm text-[var(--textNeutral)]">
            Permettre aux comptes que vous suivez et à toute personne à qui vous envoyez des messages de voir quand vous étiez actif pour la dernière fois.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
