"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Clock,
  Shield,
  HelpCircle,
  Info,
  Smartphone,
  Globe,
  Archive,
  Download,
  Trash2,
  LogOut,
  Slash,
} from "lucide-react"

// Import sub-pages
import { EditProfilePage } from "@/components/settings/edit-profile-page"
import { PrivacyPage } from "@/components/settings/privacy-page"
import { NotificationsPage } from "@/components/settings/notifications-page"
import { SecurityPage } from "@/components/settings/security-page"
import { TimeSpentPage } from "@/components/settings/time-spent-page"
import { LanguagePage } from "@/components/settings/language-page"
import ContentPreferencesPage from "@/components/settings/content-pref-page"
import BlockedPage from "@/components/settings/blocked-page"
import CloseFriendsPage from "@/components/settings/close-friends-page"
import { AboutPage } from "@/components/settings/about-page"
import { ModeToggle } from "@/components/toggle-theme"
import { useClientDictionary } from "../../context/dictionnary-context"

interface SettingsPageProps {
  onBack?: () => void
}

type SettingsView =
  | "main"
  | "edit-profile"
  | "privacy"
  | "notifications"
  | "security"
  | "content-preferences"
  | "messages"
  | "time-spent"
  | "archive"
  | "help"
  | "about"
  | "language"
  | "blocked"
  | "close-friends"

const settingsData = {
  user: {
    username: "alice_photo",
    displayName: "Alice Martin",
    avatar: "/placeholder.svg?height=60&width=60",
  },
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [currentView, setCurrentView] = useState<SettingsView>("main")
  const {dict} = useClientDictionary()
  const handleBackToMain = () => {
    setCurrentView("main")
  }

  // Render sub-pages
  if (currentView === "edit-profile") {
    return <EditProfilePage onBack={handleBackToMain} />
  }
  if (currentView === "privacy") {
    return <PrivacyPage onBack={handleBackToMain} />
  }
  if (currentView === "notifications") {
    return <NotificationsPage onBack={handleBackToMain} />
  }
  if (currentView === "security") {
    return <SecurityPage onBack={handleBackToMain} />
  }
  if (currentView === "time-spent") {
    return <TimeSpentPage onBack={handleBackToMain} />
  }
  if (currentView === "language") {
    return <LanguagePage onBack={handleBackToMain} />
  }
  if (currentView === "content-preferences") {
    return <ContentPreferencesPage onBack={handleBackToMain} />
  }
  if (currentView === "blocked") {
    return <BlockedPage onBack={handleBackToMain} />
  }
  if (currentView === "close-friends") {
    return <CloseFriendsPage onBack={handleBackToMain} />
  }
  if (currentView === "about") {
    return <AboutPage onBack={handleBackToMain} />
  }
  // Main settings page
  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b-1 border-[var(--detailMinimal)] sticky top-0 bg-[var(--bgLevel1)] z-40">
        <Button variant="ghost" size="icon" onClick={() => {
          window.location.href = "/"
        }}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-semibold text-lg flex-1">{dict.settingsPage.title}</h1>
        <div>
          <ModeToggle/>
        </div>
      </header>

      <div className=" mx-auto">
        {/* User Profile Section */}
        <div className="p-4 border-b-1 border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
          <div className="flex items-center gap-3" onClick={() => setCurrentView("edit-profile")}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={settingsData.user.avatar || "/placeholder.svg"} alt={settingsData.user.username} />
              <AvatarFallback>{settingsData.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{settingsData.user.displayName}</div>
              <div className="text-sm text-[var(--textNeutral)]">@{settingsData.user.username}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--textMinimal)]" />
          </div>
        </div>

         {/* Compte Section */}
        <div className="border-b-1 border-[var(--detailMinimal)]">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textNeutral)] mb-3">{dict.settingsPage.sections.account}</h2>
          </div>

          <SettingsItem
            icon={<User className="w-5 h-5" />}
            title={dict.settingsPage.userProfile.edit}
            subtitle={dict.settingsPage.userProfile.subtitle}
            onClick={() => setCurrentView("edit-profile")}
          />

          <SettingsItem
            icon={<Lock className="w-5 h-5" />}
            title={dict.settingsPage.settings.privacy.title}
            subtitle={dict.settingsPage.settings.privacy.subtitle}
            onClick={() => setCurrentView("privacy")}
          />

          <SettingsItem
            icon={<Bell className="w-5 h-5" />}
            title={dict.settingsPage.settings.notifications.title}
            subtitle={dict.settingsPage.settings.notifications.subtitle}
            onClick={() => setCurrentView("notifications")}
          />
        </div>

        {/* Contenu que vous voyez */}
        <div className="border-b-1 border-[var(--detailMinimal)]">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textNeutral)] mb-3">{dict.settingsPage.sections.content}</h2>
          </div>

          <SettingsItem
            icon={<Eye className="w-5 h-5" />}
            title={dict.settingsPage.settings.contentPreferences.title}
            subtitle={dict.settingsPage.settings.contentPreferences.subtitle}
            onClick={() => setCurrentView("content-preferences")}
          />

          <SettingsItem
            icon={<Heart className="w-5 h-5" />}
            title={dict.settingsPage.settings.closeFriends.title}
            subtitle={dict.settingsPage.settings.closeFriends.subtitle}
            onClick={() => setCurrentView("close-friends")}
          />

          <SettingsItem
            icon={<Slash className="w-5 h-5" />}
            title={dict.settingsPage.settings.blocked.title}
            subtitle={dict.settingsPage.settings.blocked.subtitle}
            onClick={() => setCurrentView("blocked")}
          />

          <SettingsItem
            icon={<Globe className="w-5 h-5" />}
            title={dict.settingsPage.settings.language.title}
            subtitle={dict.settingsPage.settings.language.subtitle}
            onClick={() => setCurrentView("language")}
          />
        </div>

        {/* Votre activité */}
        <div className="border-b-1 border-[var(--detailMinimal)]">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textNeutral)] mb-3">{dict.settingsPage.sections.activity}</h2>
          </div>

          <SettingsItem
            icon={<Clock className="w-5 h-5" />}
            title={dict.settingsPage.settings.timeSpent.title}
            subtitle={dict.settingsPage.settings.timeSpent.subtitle}
            onClick={() => setCurrentView("time-spent")}
          />

          <SettingsItem
            icon={<Archive className="w-5 h-5" />}
            title={dict.settingsPage.settings.archive.title}
            subtitle={dict.settingsPage.settings.archive.subtitle}
          />

          <SettingsItem
            icon={<Download className="w-5 h-5" />}
            title={dict.settingsPage.settings.downloadData.title}
            subtitle={dict.settingsPage.settings.downloadData.subtitle}
          />
        </div>

        {/* Plus d'infos et assistance */}
        <div className="border-b-1 border-[var(--detailMinimal)]">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textNeutral)] mb-3">{dict.settingsPage.sections.info}</h2>
          </div>

          {/* <SettingsItem icon={<HelpCircle className="w-5 h-5" />} title="Centre d'aide" subtitle="Obtenir de l'aide" /> */}

          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            title={dict.settingsPage.security.title}
            subtitle={dict.settingsPage.security.subtitle}
            onClick={() => setCurrentView("security")}
          />

          <SettingsItem
            icon={<Info className="w-5 h-5" />}
            title={dict.settingsPage.about.title}
            subtitle={dict.settingsPage.about.subtitle}
            onClick={() => setCurrentView("about")}
          />
        </div>

                <div className="pb-2">
          <div className="p-4 pb-2">
            <h2 className="font-semibold text-[var(--textNeutral)] mb-3">{dict.settingsPage.accountActions.title}</h2>
          </div>
          <SettingsItem
            icon={<Trash2 className="w-5 h-5 text-red-500" />}
            title={dict.settingsPage.accountActions.deleteAccount}
            titleColor="text-red-500"
          />

          <SettingsItem
            icon={<LogOut className="w-5 h-5 text-red-500" />}
            title={dict.settingsPage.accountActions.logout}
            titleColor="text-red-500"
          />
        </div>
      </div>
    </div>
  )
}

interface SettingsItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  hasSwitch?: boolean
  titleColor?: string
  onClick?: () => void
}

function SettingsItem({ icon, title, subtitle, hasSwitch, titleColor = "text-[var(--textNeutral)]", onClick }: SettingsItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-[var(--bgLevel2)] cursor-pointer transition-colors" onClick={onClick}>
      <div className="text-[var(--textMinimal)]">{icon}</div>
      <div className="flex-1">
        <div className={`font-medium ${titleColor}`}>{title}</div>
        {subtitle && <div className="text-sm text-[var(--textMinimal)]">{subtitle}</div>}
      </div>
      {hasSwitch ? <Switch /> : <ChevronRight className="w-5 h-5 text-[var(--textMinimal)]" />}
    </div>
  )
}
