// src/app/(feed)/settings/close-friends/page.tsx
'use client'

import { ChevronLeft, UserPlus, UserMinus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CloseFriendsSettings() {
  const [shareOnlyWithCloseFriends, setShareOnlyWithCloseFriends] = useState(false)
  const [closeFriendsList, setCloseFriendsList] = useState<string[]>([
    'alice123',
    'bob_the_builder',
    'charlie_chaplin'
  ])

  const addFriend = () => {
    const name = prompt('Enter username to add to Close Friends:')
    if (name && !closeFriendsList.includes(name)) {
      setCloseFriendsList((prev) => [...prev, name])
    }
  }

  const removeFriend = (username: string) => {
    setCloseFriendsList((prev) => prev.filter((u) => u !== username))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Close Friends</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Share Story Only With Close Friends</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shareOnlyWithCloseFriends}
              onChange={() => setShareOnlyWithCloseFriends(!shareOnlyWithCloseFriends)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 peer-focus:ring-2 peer-focus:ring-gray-400 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          When enabled, only users in your Close Friends list will see your story updates.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Close Friends List</h2>
          {closeFriendsList.length === 0 ? (
            <p className="text-sm text-gray-400">Your list is empty. Add people to your Close Friends list.</p>
          ) : (
            <ul className="space-y-2">
              {closeFriendsList.map((username) => (
                <li
                  key={username}
                  className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
                >
                  <span className="text-white">{username}</span>
                  <button
                    onClick={() => removeFriend(username)}
                    className="flex items-center text-gray-400 hover:text-white transition"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={addFriend}
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
          >
            <UserPlus className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-white">Add Close Friend</span>
          </button>
        </div>
      </div>
    </div>
  )
}
