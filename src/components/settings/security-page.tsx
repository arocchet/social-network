"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ChevronRight, Shield, Key, Smartphone } from "lucide-react"

interface SecurityPageProps {
  onBack?: () => void
}

export function SecurityPage({ onBack }: SecurityPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-white z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg">Sécurité</h1>
      </header>

      <div className="space-y-6">
        {/* Connexion */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-gray-900">Connexion</h2>
          </div>

          <SecurityItem
            icon={<Key className="w-5 h-5" />}
            title="Mot de passe"
            subtitle="Modifier votre mot de passe"
          />

          <SecurityItem
            icon={<Shield className="w-5 h-5" />}
            title="Authentification à deux facteurs"
            subtitle="Ajouter une couche de sécurité supplémentaire"
          />

          <SecurityItem
            icon={<Smartphone className="w-5 h-5" />}
            title="Applications et sites web"
            subtitle="Gérer les applications connectées"
          />
        </div>

        {/* Activité de connexion */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-gray-900">Activité de connexion</h2>
          </div>

          <SecurityItem title="Où vous êtes connecté(e)" subtitle="Voir vos sessions actives" />

          <SecurityItem title="Tentatives de connexion" subtitle="Voir les tentatives de connexion récentes" />

          <SecurityItem title="E-mails d'Instagram" subtitle="Voir les e-mails récents d'Instagram" />
        </div>

        {/* Données et téléchargements */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-gray-900">Données et téléchargements</h2>
          </div>

          <SecurityItem title="Télécharger vos informations" subtitle="Demander une copie de vos données" />

          <SecurityItem title="Transférer vos informations" subtitle="Transférer une copie de vos photos et vidéos" />
        </div>

        {/* Paramètres de sécurité */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-gray-900">Paramètres de sécurité</h2>
          </div>

          <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Alertes de sécurité</div>
              <div className="text-sm text-gray-600">Recevoir des alertes sur l'activité de connexion</div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Connexions suspectes</div>
              <div className="text-sm text-gray-600">Être alerté des connexions inhabituelles</div>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SecurityItemProps {
  icon?: React.ReactNode
  title: string
  subtitle: string
}

function SecurityItem({ icon, title, subtitle }: SecurityItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
      {icon && <div className="text-gray-600">{icon}</div>}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  )
}
