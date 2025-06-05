// src/app/(feed)/settings/tags/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function TagsMentionsSettings() {
  const [allowTags, setAllowTags] = useState<'off' | 'everyone' | 'following'>('everyone')
  const [allowMentions, setAllowMentions] = useState<'off' | 'everyone' | 'following'>('everyone')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Tags & Mentions</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Allow Tags */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Allow Tags</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-tags"
                id="tags-off"
                value="off"
                checked={allowTags === 'off'}
                onChange={() => setAllowTags('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="tags-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-tags"
                id="tags-following"
                value="following"
                checked={allowTags === 'following'}
                onChange={() => setAllowTags('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="tags-following" className="ml-3 text-base">
                From profiles I follow
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-tags"
                id="tags-everyone"
                value="everyone"
                checked={allowTags === 'everyone'}
                onChange={() => setAllowTags('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="tags-everyone" className="ml-3 text-base">
                From everyone
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            johnappleseed tagged you in a photo.
          </p>
        </div>

        {/* Allow Mentions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Allow Mentions</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-mentions"
                id="mentions-off"
                value="off"
                checked={allowMentions === 'off'}
                onChange={() => setAllowMentions('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="mentions-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-mentions"
                id="mentions-following"
                value="following"
                checked={allowMentions === 'following'}
                onChange={() => setAllowMentions('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="mentions-following" className="ml-3 text-base">
                From profiles I follow
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="allow-mentions"
                id="mentions-everyone"
                value="everyone"
                checked={allowMentions === 'everyone'}
                onChange={() => setAllowMentions('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="mentions-everyone" className="ml-3 text-base">
                From everyone
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            johnappleseed mentioned you in a comment.
          </p>
        </div>
      </div>
    </div>
  )
}
