// src/app/(feed)/settings/sharing/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SharingSettings() {
  const [allowReshareToStories, setAllowReshareToStories] = useState(true)
  const [allowDownload, setAllowDownload] = useState(false)
  const [allowEmbedding, setAllowEmbedding] = useState<'off' | 'everyone' | 'following'>('everyone')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Sharing &amp; Reuse</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Reshare to Stories Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Allow Resharing to Stories</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowReshareToStories}
              onChange={() => setAllowReshareToStories(!allowReshareToStories)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          Others can share your posts to their stories when enabled.
        </p>

        {/* Allow Download Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Allow Download of Your Posts</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={() => setAllowDownload(!allowDownload)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          When enabled, people can download your photos and videos.
        </p>

        {/* Embedding Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Embed Content</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="embedding"
                id="embed-off"
                value="off"
                checked={allowEmbedding === 'off'}
                onChange={() => setAllowEmbedding('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="embed-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="embedding"
                id="embed-following"
                value="following"
                checked={allowEmbedding === 'following'}
                onChange={() => setAllowEmbedding('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="embed-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="embedding"
                id="embed-everyone"
                value="everyone"
                checked={allowEmbedding === 'everyone'}
                onChange={() => setAllowEmbedding('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="embed-everyone" className="ml-3 text-base">From everyone</label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Controls who can embed your posts on external websites. johnappleseed embedded your photo.
          </p>
        </div>
      </div>
    </div>
  )
}
