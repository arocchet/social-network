"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import { useUser } from "@/hooks/use-user-data"
import { toast } from "sonner"

interface PrivacyPageProps {
  onBack?: () => void
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
  const { user, loading, refetch } = useUser()
  const [isPrivate, setIsPrivate] = useState(false)
  const [allowFollows, setAllowFollows] = useState<'everyone' | 'approved'>('everyone')
  const [showActivityStatus, setShowActivityStatus] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync with user data
  useEffect(() => {
    if (user) {
      setIsPrivate(user.visibility === 'PRIVATE')
    }
  }, [user])

  const handlePrivacyToggle = async (checked: boolean) => {
    if (!user || isUpdating) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/private/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          visibility: checked ? 'PRIVATE' : 'PUBLIC'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update privacy settings')
      }

      setIsPrivate(checked)
      refetch() // Refresh user data
      toast.success(checked ? 'Compte passé en privé' : 'Compte passé en public')
    } catch (error) {
      console.error('Error updating privacy:', error)
      toast.error('Erreur lors de la mise à jour des paramètres')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bgLevel1)] flex items-center justify-center">
        <div className="text-[var(--textMinimal)]">Chargement...</div>
      </div>
    )
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
              onCheckedChange={handlePrivacyToggle}
              disabled={isUpdating}
            />
          </div>
          <p className="text-sm text-[var(--textNeutral)]">
            {isPrivate 
              ? "Votre compte est privé. Seules les personnes que vous approuvez peuvent vous suivre et voir votre contenu."
              : "Votre compte est public. Tout le monde peut vous suivre et voir votre contenu."
            }
          </p>
        </div>

        {/* Qui peut vous suivre */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--textMinimal)]">Qui peut vous suivre</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-follows"
                id="follows-everyone"
                value="everyone"
                checked={allowFollows === 'everyone'}
                onChange={() => setAllowFollows('everyone')}
                className="w-4 h-4 text-blue-500 bg-[var(--bgLevel2)] border-[var(--detailMinimal)]"
              />
              <label htmlFor="follows-everyone" className="ml-3 text-base text-[var(--textMinimal)]">
                Tout le monde
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-follows"
                id="follows-approved"
                value="approved"
                checked={allowFollows === 'approved'}
                onChange={() => setAllowFollows('approved')}
                className="w-4 h-4 text-blue-500 bg-[var(--bgLevel2)] border-[var(--detailMinimal)]"
              />
              <label htmlFor="follows-approved" className="ml-3 text-base text-[var(--textMinimal)]">
                Seulement les abonnés approuvés
              </label>
            </div>
          </div>
          <p className="text-sm text-[var(--textNeutral)]">
            {allowFollows === 'everyone'
              ? 'N\'importe qui peut vous envoyer des demandes d\'abonnement.'
              : 'Seuls les utilisateurs que vous approuvez peuvent vous suivre.'}
          </p>
        </div>

        {/* Statut d'activité */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--textMinimal)]">Afficher le statut d'activité</span>
            <Switch 
              checked={showActivityStatus}
              onCheckedChange={setShowActivityStatus}
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