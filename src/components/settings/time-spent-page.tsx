"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, TrendingUp, Bell, Timer, Moon } from "lucide-react"

interface TimeSpentPageProps {
  onBack?: () => void
}

export function TimeSpentPage({ onBack }: TimeSpentPageProps) {
  const weeklyData = [
    { day: "Lun", time: 45 },
    { day: "Mar", time: 32 },
    { day: "Mer", time: 67 },
    { day: "Jeu", time: 23 },
    { day: "Ven", time: 89 },
    { day: "Sam", time: 156 },
    { day: "Dim", time: 134 },
  ]

  const averageTime = Math.round(weeklyData.reduce((acc, day) => acc + day.time, 0) / 7)

  const handleSave = () => {
    console.log('Paramètres sauvegardés')
    onBack?.()
  }

  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      <header className="flex items-center gap-4 p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg text-[var(--textMinimal)]">Temps passé</h1>
      </header>

      <div className="p-4 space-y-6 max-w-3xl mx-auto">
        {/* Statistiques aujourd'hui */}
        <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="font-semibold text-lg text-[var(--textMinimal)]">Aujourd'hui</h2>
          </div>
          <div className="text-3xl font-bold text-[var(--textMinimal)] mb-2">2h 34min</div>
          <div className="text-sm text-[var(--textNeutral)]">+23min par rapport à hier</div>
        </div>

        {/* Moyenne hebdomadaire */}
        <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="font-semibold text-lg text-[var(--textMinimal)]">Moyenne quotidienne</h2>
          </div>
          <div className="text-3xl font-bold text-[var(--textMinimal)] mb-2">
            {Math.floor(averageTime / 60)}h {averageTime % 60}min
          </div>
          <div className="text-sm text-[var(--textNeutral)]">Cette semaine</div>
        </div>

        {/* Graphique hebdomadaire */}
        <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-[var(--textMinimal)]">Activité de la semaine</h3>
          <div className="flex items-end justify-between gap-2 h-32 mb-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-600 rounded-t w-full min-h-1"
                  style={{ height: `${(day.time / Math.max(...weeklyData.map((d) => d.time))) * 100}%` }}
                />
                <div className="text-xs text-[var(--textNeutral)] mt-2">{day.day}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[var(--textNeutral)]">
            <span>0min</span>
            <span>{Math.max(...weeklyData.map((d) => d.time))}min</span>
          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center">
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
          <span className="px-4 text-sm text-[var(--textNeutral)]">Paramètres</span>
          <div className="flex-1 border-t border-[var(--detailMinimal)]" />
        </div>

        {/* Rappel de pause */}
        <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--textNeutral)]" />
            <div>
              <div className="font-medium text-[var(--textMinimal)]">Rappel de pause</div>
              <div className="text-sm text-[var(--textNeutral)]">Vous rappeler de faire une pause</div>
            </div>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 text-[var(--blue)] bg-[var(--bgLevel2)] border-[var(--detailMinimal)] rounded focus:ring-[var(--blue)]"
          />
        </div>

        {/* Limite quotidienne */}
        <div className="bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="w-5 h-5 text-[var(--textNeutral)]" />
            <div>
              <div className="font-medium text-[var(--textMinimal)]">Limite quotidienne</div>
              <div className="text-sm text-[var(--textNeutral)]">Définir une limite de temps quotidienne</div>
            </div>
          </div>
          <select className="w-full p-3 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] rounded-lg text-[var(--textMinimal)] focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent">
            <option value="none">Aucune limite</option>
            <option value="30">30 minutes</option>
            <option value="60">1 heure</option>
            <option value="120">2 heures</option>
            <option value="180">3 heures</option>
          </select>
        </div>

        {/* Mode silencieux */}
        <div className="flex items-center justify-between p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-[var(--textNeutral)]" />
            <div>
              <div className="font-medium text-[var(--textMinimal)]">Mode silencieux</div>
              <div className="text-sm text-[var(--textNeutral)]">Désactiver les notifications pendant certaines heures</div>
            </div>
          </div>
          <input
            type="checkbox"
            className="w-4 h-4 text-[var(--blue)] bg-[var(--bgLevel2)] border-[var(--detailMinimal)] rounded focus:ring-[var(--blue)]"
          />
        </div>

        {/* Informations */}
        <div className="p-4 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] rounded-lg">
          <div className="text-sm text-[var(--textNeutral)]">
            <p className="mb-2">
              <strong className="text-[var(--textMinimal)]">Note :</strong> Les statistiques de temps sont calculées localement sur votre appareil.
            </p>
            <p>
              Les rappels et limites vous aident à maintenir un usage équilibré de l'application.
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