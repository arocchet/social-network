// src/app/(feed)/settings/like-share-counts/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LikeShareCountsSettings() {
  const [showLikeCount, setShowLikeCount] = useState(true)
  const [showShareCount, setShowShareCount] = useState(true)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Like &amp; Share Counts</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Show Like Counts</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showLikeCount}
              onChange={() => setShowLikeCount(!showLikeCount)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg">Show Share Counts</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showShareCount}
              onChange={() => setShowShareCount(!showShareCount)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
      </div>
    </div>
  )
}
