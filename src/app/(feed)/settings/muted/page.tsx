// src/app/(feed)/settings/muted/page.tsx
'use client'

import { ChevronLeft, VolumeX, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MutedAccountsSettings() {
  const [mutedAccounts, setMutedAccounts] = useState<string[]>([
    'noisy_user',
    'annoying_commenter'
  ])
  const [unmuteAll, setUnmuteAll] = useState(false)

  const removeMuted = (username: string) => {
    setMutedAccounts(prev => prev.filter(u => u !== username))
  }

  const addMuted = () => {
    const name = prompt('Enter username to mute:')
    if (name && !mutedAccounts.includes(name)) {
      setMutedAccounts(prev => [...prev, name])
    }
  }

  const toggleUnmuteAll = () => {
    if (unmuteAll) {
      setMutedAccounts(['noisy_user', 'annoying_commenter'])
    } else {
      setMutedAccounts([])
    }
    setUnmuteAll(!unmuteAll)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Muted Accounts</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Unmute All</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={unmuteAll}
              onChange={toggleUnmuteAll}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        {mutedAccounts.length === 0 ? (
          <p className="text-sm text-gray-400">
            You have no muted accounts.
          </p>
        ) : (
          <ul className="space-y-2">
            {mutedAccounts.map(username => (
              <li
                key={username}
                className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
              >
                <span className="text-white">{username}</span>
                <button
                  onClick={() => removeMuted(username)}
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={addMuted}
          className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
        >
          <VolumeX className="w-5 h-5 text-gray-300" />
          <span className="text-sm text-white">Mute New Account</span>
        </button>
      </div>
    </div>
  )
}
