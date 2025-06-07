'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Image, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ContentPreferencesProps {
  onBack?: () => void
}

export default function ContentPreferencesSettings({ onBack }: ContentPreferencesProps) {
  const [videoAutoplay, setVideoAutoplay] = useState(true)
  const [mediaQuality, setMediaQuality] = useState<'low' | 'medium' | 'high'>('high')
  const [showSensitiveContent, setShowSensitiveContent] = useState(false)

  const handleSave = () => {
    console.log('Video Autoplay:', videoAutoplay)
    console.log('Media Quality:', mediaQuality)
    console.log('Show Sensitive Content:', showSensitiveContent)
    onBack?.()
  }

  const qualityOptions = [
    { value: 'low', label: 'Faible', description: 'Économise la bande passante' },
    { value: 'medium', label: 'Moyenne', description: 'Équilibre qualité/performance' },
    { value: 'high', label: 'Élevée', description: 'Meilleure qualité disponible' }
  ]

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg text-[var(--textMinimal)]">Préférences de contenu</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Lecture automatique des vidéos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-[var(--textNeutral)]" />
              <div>
                <div className="font-medium text-[var(--textMinimal)]">Lecture automatique des vidéos</div>
                <div className="text-sm text-[var(--textNeutral)]">Les vidéos se lancent automatiquement</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={videoAutoplay}
              onChange={(e) => setVideoAutoplay(e.target.checked)}
              className="w-4 h-4 bg-[var(--bgLevel2)] border-[var(--detailMinimal)] rounded "
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
          <span className="px-4 text-sm text-[var(--textNeutral)]">Qualité média</span>
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
        </div>

        {/* Qualité des médias */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-[var(--textNeutral)]" />
            <h2 className="font-medium text-[var(--textMinimal)]">Qualité des médias</h2>
          </div>
          <div className="space-y-1">
            {qualityOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  mediaQuality === option.value
                    ? 'bg-[var(--bgLevel2)] border border-[var(--detailMinimal)]'
                    : 'hover:bg-[var(--bgLevel2)]'
                }`}
                onClick={() => setMediaQuality(option.value as 'low' | 'medium' | 'high')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="media-quality"
                    value={option.value}
                    checked={mediaQuality === option.value}
                    onChange={() => setMediaQuality(option.value as 'low' | 'medium' | 'high')}
                    className="w-4 h-4 bg-[var(--bgLevel2)] border-[var(--detailMinimal)]"
                  />
                  <div>
                    <div className={`font-medium ${
                      mediaQuality === option.value 
                        ? 'text-[var(--textNeutral)]' 
                        : 'text-[var(--textMinimal)]'
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-sm text-[var(--textNeutral)]">{option.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu sensible */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[var(--textNeutral)]" />
              <div>
                <div className="font-medium text-[var(--textMinimal)]">Afficher le contenu sensible</div>
                <div className="text-sm text-[var(--textNeutral)]">Affiche les avertissements et aperçus de contenu sensible</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showSensitiveContent}
              onChange={(e) => setShowSensitiveContent(e.target.checked)}
              className="w-4 h-4 bg-[var(--bgLevel2)] border-[var(--detailMinimal)] rounded"
            />
          </div>
        </div>

        {/* Informations */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="text-sm text-[var(--textNeutral)]">
            <p className="mb-2">
              <strong className="text-[var(--textMinimal)]">Note :</strong> Ces paramètres affectent la façon dont le contenu multimédia est affiché.
            </p>
            <p>
              Les modifications de qualité peuvent nécessiter un rechargement des pages pour prendre effet.
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