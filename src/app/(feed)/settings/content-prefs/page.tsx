// src/app/(feed)/settings/content-prefs/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ContentPreferencesSettings() {
  const [videoAutoplay, setVideoAutoplay] = useState(true)
  const [mediaQuality, setMediaQuality] = useState<'low' | 'medium' | 'high'>('high')
  const [showSensitiveContent, setShowSensitiveContent] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Content Preferences</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Video Autoplay</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={videoAutoplay}
              onChange={() => setVideoAutoplay(!videoAutoplay)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          When enabled, videos will play automatically.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Media Quality</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="media-quality"
                id="quality-low"
                value="low"
                checked={mediaQuality === 'low'}
                onChange={() => setMediaQuality('low')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="quality-low" className="ml-3 text-base">Low</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="media-quality"
                id="quality-medium"
                value="medium"
                checked={mediaQuality === 'medium'}
                onChange={() => setMediaQuality('medium')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="quality-medium" className="ml-3 text-base">Medium</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="media-quality"
                id="quality-high"
                value="high"
                checked={mediaQuality === 'high'}
                onChange={() => setMediaQuality('high')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="quality-high" className="ml-3 text-base">High</label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg">Show Sensitive Content</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showSensitiveContent}
              onChange={() => setShowSensitiveContent(!showSensitiveContent)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          When enabled, you will see sensitive content warnings and previews.
        </p>
      </div>
    </div>
  )
}
