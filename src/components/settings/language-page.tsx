"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Globe } from "lucide-react"

interface LanguagePageProps {
  onBack?: () => void
}

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
]

export function LanguagePage({ onBack }: LanguagePageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [autoDetect, setAutoDetect] = useState(false)

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
  }

  const handleSave = () => {
    // Logique de sauvegarde ici
    console.log('Langue sélectionnée:', selectedLanguage)
    console.log('Détection automatique:', autoDetect)
    onBack?.()
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg text-[var(--textMinimal)]">Langue</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Détection automatique */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[var(--textNeutral)]" />
              <div>
                <div className="font-medium text-[var(--textMinimal)]">Détection automatique</div>
                <div className="text-sm text-[var(--textNeutral)]">Détecter automatiquement la langue du navigateur</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-[var(--bgLevel2)] border-[var(--detailMinimal)] rounded focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
          <span className="px-4 text-sm text-[var(--textNeutral)]">ou choisir manuellement</span>
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
        </div>

        {/* Liste des langues */}
        <div className="space-y-2">
          <h2 className="font-medium text-[var(--textMinimal)] mb-4">Langues disponibles</h2>
          <div className="space-y-1">
            {AVAILABLE_LANGUAGES.map((language) => (
              <div
                key={language.code}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedLanguage === language.code && !autoDetect
                    ? 'bg-[var(--bgLevel2)] border-1 border-[var(--detailMinimal)]'
                    : 'hover:bg-[var(--bgLevel2)]'
                }`}
                onClick={() => {
                  if (!autoDetect) {
                    handleLanguageChange(language.code)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className={`font-medium ${
                      selectedLanguage === language.code && !autoDetect 
                        ? 'text-blue-600' 
                        : 'text-[var(--textMinimal)]'
                    }`}>
                      {language.nativeName}
                    </div>
                    <div className="text-sm text-[var(--textNeutral)]">{language.name}</div>
                  </div>
                </div>
                {selectedLanguage === language.code && !autoDetect && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informations */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="text-sm text-[var(--textNeutral)]">
            <p className="mb-2">
              <strong className="text-[var(--textMinimal)]">Note :</strong> Le changement de langue affectera l'interface utilisateur de l'application.
            </p>
            <p>
              Certaines fonctionnalités peuvent nécessiter un redémarrage de l'application pour prendre effet.
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