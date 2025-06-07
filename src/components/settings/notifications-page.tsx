"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"

interface NotificationsPageProps {
  onBack?: () => void
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b-1 border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg text-[var(--textMinimal)]">Notifications</h1>
      </header>

      <div className="space-y-6  max-w-3xl mx-auto">
        {/* Notifications push */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textMinimal)]">Notifications push</h2>
          </div>

          <NotificationItem
            title="Mettre en pause toutes les notifications"
            subtitle="Suspendre temporairement les notifications push"
            hasSwitch={true}
          />

          <NotificationItem
            title="Publications, stories et commentaires"
            subtitle="J'aime, commentaires, premières publications et stories"
            hasSwitch={true}
          />

          <NotificationItem
            title="Abonnés et abonnements"
            subtitle="Nouvelles demandes d'abonnement et suggestions"
            hasSwitch={true}
          />

          <NotificationItem title="Messages directs" subtitle="Demandes de messages et messages" hasSwitch={true} />

          <NotificationItem
            title="Diffusions en direct et IGTV"
            subtitle="Notifications de diffusions en direct"
            hasSwitch={true}
          />

          <NotificationItem
            title="Rappels"
            subtitle="Rappels de publications et suggestions d'activité"
            hasSwitch={true}
          />
        </div>

        {/* Notifications par e-mail */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textMinimal)]">Notifications par e-mail</h2>
          </div>

          <NotificationItem title="Commentaires" subtitle="Commentaires sur vos publications" hasSwitch={true} />

          <NotificationItem
            title="Rappels de commentaires"
            subtitle="Rappels pour répondre aux commentaires"
            hasSwitch={true}
          />

          <NotificationItem title="J'aime" subtitle="J'aime sur vos publications" hasSwitch={true} />

          <NotificationItem title="Abonnés" subtitle="Nouveaux abonnés" hasSwitch={true} />

          <NotificationItem title="Messages directs" subtitle="Nouveaux messages directs" hasSwitch={true} />
        </div>

        {/* Notifications SMS */}
        <div>
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textMinimal)]">Notifications SMS</h2>
          </div>

          <NotificationItem
            title="Rappels de sécurité"
            subtitle="Codes de connexion et alertes de sécurité"
            hasSwitch={true}
          />

          <NotificationItem
            title="Mises à jour de produit"
            subtitle="Nouvelles fonctionnalités et mises à jour"
            hasSwitch={true}
          />
        </div>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  title: string
  subtitle: string
  hasSwitch?: boolean
}

function NotificationItem({ title, subtitle, hasSwitch }: NotificationItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-[var(--bgLevel2)] transition-colors">
      <div className="flex-1">
        <div className="font-medium text-[var(--textMinimal)]">{title}</div>
        <div className="text-sm text-[var(--textNeutral)]">{subtitle}</div>
      </div>
      {hasSwitch && <Switch />}
    </div>
  )
}