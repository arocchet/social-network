// src/app/(feed)/settings/notifications/page.tsx
'use client'

import { ChevronRight } from 'lucide-react'

export default function NotificationsSettings() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-16 pb-8">
      <h1 className="text-3xl font-semibold text-white mb-8">Notifications</h1>
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-2xl border border-[#3a3a3c] overflow-hidden">
        <a
          href="/settings/notifications/push"
          className="flex justify-between items-center px-6 py-4 border-b border-[#3a3a3c] hover:bg-[#2c2c2e] transition"
        >
          <span className="text-white text-lg">Push notifications</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
        <a
          href="/settings/notifications/email"
          className="flex justify-between items-center px-6 py-4 hover:bg-[#2c2c2e] transition"
        >
          <span className="text-white text-lg">Email notifications</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
      </div>
    </div>
  )
}
