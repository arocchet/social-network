// src/app/(feed)/settings/hide-story/page.tsx
'use client'

import { ChevronLeft, EyeOff, UserMinus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HideStorySettings() {
  const [hiddenFromList, setHiddenFromList] = useState<string[]>([
    'spam_account_123',
    'troll_user'
  ])

  const removeFromHidden = (username: string) => {
    setHiddenFromList((prev) => prev.filter((u) => u !== username))
  }

  const addToHidden = () => {
    const name = prompt('Enter username to hide story & live from:')
    if (name && !hiddenFromList.includes(name)) {
      setHiddenFromList((prev) => [...prev, name])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Hide Story & Live</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex items-center space-x-3">
          <EyeOff className="w-6 h-6 text-gray-400" />
          <span className="text-lg">Hide your Story and Live from these accounts:</span>
        </div>

        {hiddenFromList.length === 0 ? (
          <p className="text-sm text-gray-400">
            You are currently not hiding your Story & Live from anyone.
          </p>
        ) : (
          <ul className="space-y-2">
            {hiddenFromList.map((username) => (
              <li
                key={username}
                className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
              >
                <span className="text-white">{username}</span>
                <button
                  onClick={() => removeFromHidden(username)}
                  className="flex items-center text-gray-400 hover:text-white transition"
                >
                  <UserMinus className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={addToHidden}
          className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
        >
          <UserPlus className="w-5 h-5 text-gray-300" />
          <span className="text-sm text-white">Add Account to Hide From</span>
        </button>
      </div>
    </div>
  )
}
