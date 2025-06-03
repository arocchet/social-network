// src/app/(feed)/settings/layout.tsx
import React from 'react'
import Settings from '@/components/settings/SettingsMain'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen bg-[var(--bgLevel2)]">
      {/* Sidebar “Settings” visible uniquement en md+ (≥768px) */}
      <aside className="hidden md:block h-screen overflow-y-auto bg-[var(--bgLevel2)]">
        <Settings />
      </aside>
      {/* Contenu principal des pages /settings/* */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
