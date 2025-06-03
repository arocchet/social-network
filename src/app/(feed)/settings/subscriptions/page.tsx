// src/app/(feed)/settings/subscriptions/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SubscriptionsSettings() {
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([
    'tech_news',
    'daily_updates'
  ])

  const unsubscribe = (channel: string) => {
    setSubscribedChannels(prev => prev.filter(c => c !== channel))
  }

  const subscribeNew = () => {
    const channel = prompt('Enter channel or user to subscribe to:')
    if (channel && !subscribedChannels.includes(channel)) {
      setSubscribedChannels(prev => [...prev, channel])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Subscribed Channels</h2>

          {subscribedChannels.length === 0 ? (
            <p className="text-sm text-gray-400">
              You are not subscribed to any channels.
            </p>
          ) : (
            <ul className="space-y-2">
              {subscribedChannels.map(channel => (
                <li
                  key={channel}
                  className="flex justify-between items-center p-3 bg-[#1c1c1e] rounded-lg"
                >
                  <span className="text-white">{channel}</span>
                  <button
                    onClick={() => unsubscribe(channel)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    Unsubscribe
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={subscribeNew}
            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#242526] rounded-lg hover:bg-[#3a3a3c] transition"
          >
            <span className="text-sm text-white">Subscribe to New Channel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
