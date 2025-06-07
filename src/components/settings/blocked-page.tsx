'use client'

import { ArrowLeft, UserMinus, UserPlus, Shield, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'

interface BlockedSettingsProps {
  onBack?: () => void
}

export default function BlockedPage({ onBack }: BlockedSettingsProps) {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([
    'spam_account_123',
    'troll_user',
    'annoying_bot'
  ])
  const [newUsername, setNewUsername] = useState('')

  const unblockUser = (username: string) => {
    setBlockedUsers(prev => prev.filter(u => u !== username))
  }

  const blockNewUser = () => {
    if (newUsername.trim() && !blockedUsers.includes(newUsername.trim())) {
      setBlockedUsers(prev => [...prev, newUsername.trim()])
      setNewUsername('')
    }
  }

  const handleSave = () => {
    console.log('Blocked users:', blockedUsers)
    onBack?.()
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg text-[var(--textMinimal)]">Utilisateurs bloqués</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Ajouter un nouvel utilisateur à bloquer */}
        <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-5 h-5 text-[var(--textNeutral)]" />
            <div>
              <div className="font-medium text-[var(--textMinimal)]">Bloquer un utilisateur</div>
              <div className="text-sm text-[var(--textNeutral)]">Ajouter un nom d'utilisateur à la liste des bloqués</div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="flex-1 p-3 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] rounded-lg text-[var(--textMinimal)] placeholder-[var(--textNeutral)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && blockNewUser()}
            />
            <Button 
              onClick={blockNewUser}
              disabled={!newUsername.trim() || blockedUsers.includes(newUsername.trim())}
              className="px-6"
            >
              Bloquer
            </Button>
          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
          <span className="px-4 text-sm text-[var(--textNeutral)]">Utilisateurs actuellement bloqués</span>
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
        </div>

        {/* Liste des utilisateurs bloqués */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[var(--textNeutral)]" />
            <h2 className="font-medium text-[var(--textMinimal)]">
              Utilisateurs bloqués ({blockedUsers.length})
            </h2>
          </div>

          {blockedUsers.length === 0 ? (
            <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-6 text-center">
              <User className="w-12 h-12 text-[var(--textNeutral)] mx-auto mb-3" />
              <div className="font-medium text-[var(--textMinimal)] mb-2">Aucun utilisateur bloqué</div>
              <div className="text-sm text-[var(--textNeutral)]">
                Vous n'avez bloqué aucun utilisateur pour le moment.
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {blockedUsers.map((username) => (
                <div
                  key={username}
                  className="flex items-center justify-between p-3 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg hover:bg-[var(--bgLevel1)] hover:border-[var(--detailNeutral)]transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[var(--textNeutral)]" />
                    <div>
                      <div className="font-medium text-[var(--textMinimal)]">@{username}</div>
                      <div className="text-sm text-[var(--textNeutral)]">Utilisateur bloqué</div>
                    </div>
                  </div>
                  <button
                    onClick={() => unblockUser(username)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-[var(--red)] hover:bg-red-50 rounded-md transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    Débloquer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="text-sm text-[var(--textNeutral)]">
            <p className="mb-2">
              <strong className="text-[var(--textMinimal)]">Note :</strong> Les utilisateurs bloqués ne pourront plus vous contacter ou voir votre contenu.
            </p>
            <p>
              Vous pouvez débloquer un utilisateur à tout moment en cliquant sur le bouton correspondant.
            </p>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  )
}