// src/app/(feed)/settings/comments/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CommentsSettings() {
  const [comments, setComments] = useState<'off' | 'following' | 'everyone'>('everyone')
  const [commentLikes, setCommentLikes] = useState<'off' | 'on'>('on')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Comments</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Comments</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="comments"
                id="comments-off"
                value="off"
                checked={comments === 'off'}
                onChange={() => setComments('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comments-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="comments"
                id="comments-following"
                value="following"
                checked={comments === 'following'}
                onChange={() => setComments('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comments-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="comments"
                id="comments-everyone"
                value="everyone"
                checked={comments === 'everyone'}
                onChange={() => setComments('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comments-everyone" className="ml-3 text-base">From everyone</label>
            </div>
          </div>
          <p className="text-sm text-gray-400">johnappleseed commented: “Nice shot!”</p>
        </div>

        {/* Comment Likes Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Comment Likes</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="comment-likes"
                id="comment-likes-off"
                value="off"
                checked={commentLikes === 'off'}
                onChange={() => setCommentLikes('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comment-likes-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="comment-likes"
                id="comment-likes-on"
                value="on"
                checked={commentLikes === 'on'}
                onChange={() => setCommentLikes('on')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comment-likes-on" className="ml-3 text-base">On</label>
            </div>
          </div>
          <p className="text-sm text-gray-400">johnappleseed liked your comment: Nice shot!</p>
        </div>
      </div>
    </div>
  )
}
