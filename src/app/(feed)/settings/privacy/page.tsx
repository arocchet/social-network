// src/app/(feed)/settings/privacy/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AccountPrivacySettings() {
  const [isPrivate, setIsPrivate] = useState(false)
  const [allowFollows, setAllowFollows] = useState<'everyone' | 'approved'>('everyone')
  const [showActivityStatus, setShowActivityStatus] = useState(true)

  return (
    <div className="min-h-screen bg-[var(--bgLevel2)] text-white p-6 md:px-20 lg:px-40">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Account Privacy</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Private Account Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Private Account</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 peer-focus:ring-2 peer-focus:ring-gray-400 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          When your account is private, only people you approve can see your content.
        </p>

        {/* Who Can Follow You */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Who can follow you</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-follows"
                id="follows-everyone"
                value="everyone"
                checked={allowFollows === 'everyone'}
                onChange={() => setAllowFollows('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="follows-everyone" className="ml-3 text-base">
                Everyone
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-follows"
                id="follows-approved"
                value="approved"
                checked={allowFollows === 'approved'}
                onChange={() => setAllowFollows('approved')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="follows-approved" className="ml-3 text-base">
                Only approved followers
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {allowFollows === 'everyone'
              ? 'Anyone can send you follow requests.'
              : 'Only users you approve can follow you.'}
          </p>
        </div>

        {/* Show Activity Status Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Show Activity Status</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showActivityStatus}
              onChange={() => setShowActivityStatus(!showActivityStatus)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 peer-focus:ring-2 peer-focus:ring-gray-400 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          Allow accounts you follow and anyone you message to see when you were last active.
        </p>
      </div>
    </div>
  )
}
