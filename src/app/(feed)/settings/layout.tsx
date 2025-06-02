// src/app/(feed)/settings/layout.tsx
import React from 'react'
import Settings from '@/components/settings/SettingsMain'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen">
      {/* Sidebar “Settings” visible uniquement en md+ (≥768px) */}
        <Settings />
      {/* Contenu principal des pages /settings/* */}
      <main className="flex justify-center">
        {children}
      </main>
    </div>
  )
}
