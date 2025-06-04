// src/app/(feed)/settings/blocked/page.tsx
'use client'

import { ChevronLeft, UserMinus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BlockedSettings() {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([
    'spam_account_123',
    'troll_user',
    'annoying_bot'
  ])

  const unblockUser = (username: string) => {
    setBlockedUsers(prev => prev.filter(u => u !== username))
  }

  const blockNewUser = () => {
    const name = prompt('Enter username to block:')
    if (name && !blockedUsers.includes(name)) {
      setBlockedUsers(prev => [...prev, name])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Blocked</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Blocked Users</h2>
          {blockedUsers.length === 0 ? (
            <p className="text-sm text-gray-400">You haven’t blocked anyone yet.</p>
          ) : (
            <ul className="space-y-2">
              {blockedUsers.map(username => (
                <li
                  key={username}
                  className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
                >
                  <span className="text-white">{username}</span>
                  <button
                    onClick={() => unblockUser(username)}
                    className="flex items-center text-gray-400 hover:text-white transition"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={blockNewUser}
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
          >
            <UserPlus className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-white">Block New User</span>
          </button>
        </div>
      </div>
    </div>
  )
}
