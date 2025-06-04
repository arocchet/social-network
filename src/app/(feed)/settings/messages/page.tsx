// src/app/(feed)/settings/messages/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MessagesStoryRepliesSettings() {
  const [messageRequests, setMessageRequests] = useState<'off' | 'from-following' | 'from-everyone'>('from-following')
  const [messageReplies, setMessageReplies] = useState<'off' | 'from-following' | 'from-everyone'>('from-everyone')
  const [storyReplies, setStoryReplies] = useState<'off' | 'from-following' | 'from-everyone'>('from-following')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Messages & Story Replies</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Message Requests Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Message Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="message-requests"
                id="msg-req-off"
                value="off"
                checked={messageRequests === 'off'}
                onChange={() => setMessageRequests('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-req-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="message-requests"
                id="msg-req-following"
                value="from-following"
                checked={messageRequests === 'from-following'}
                onChange={() => setMessageRequests('from-following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-req-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="message-requests"
                id="msg-req-everyone"
                value="from-everyone"
                checked={messageRequests === 'from-everyone'}
                onChange={() => setMessageRequests('from-everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-req-everyone" className="ml-3 text-base">From everyone</label>
            </div>
            <p className="text-sm text-gray-400">
              Controls who can send you message requests. johnappleseed sent you a request.
            </p>
          </div>
        </div>

        {/* Message Replies Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Message Replies</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="message-replies"
                id="msg-replies-off"
                value="off"
                checked={messageReplies === 'off'}
                onChange={() => setMessageReplies('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-replies-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="message-replies"
                id="msg-replies-following"
                value="from-following"
                checked={messageReplies === 'from-following'}
                onChange={() => setMessageReplies('from-following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-replies-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="message-replies"
                id="msg-replies-everyone"
                value="from-everyone"
                checked={messageReplies === 'from-everyone'}
                onChange={() => setMessageReplies('from-everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="msg-replies-everyone" className="ml-3 text-base">From everyone</label>
            </div>
            <p className="text-sm text-gray-400">
              Controls who can reply to your messages. johnappleseed replied: “Hey there!”
            </p>
          </div>
        </div>

        {/* Story Replies Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Story Replies</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="story-replies"
                id="story-replies-off"
                value="off"
                checked={storyReplies === 'off'}
                onChange={() => setStoryReplies('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="story-replies-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="story-replies"
                id="story-replies-following"
                value="from-following"
                checked={storyReplies === 'from-following'}
                onChange={() => setStoryReplies('from-following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="story-replies-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="story-replies"
                id="story-replies-everyone"
                value="from-everyone"
                checked={storyReplies === 'from-everyone'}
                onChange={() => setStoryReplies('from-everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="story-replies-everyone" className="ml-3 text-base">From everyone</label>
            </div>
            <p className="text-sm text-gray-400">
              Controls who can reply to your stories. johnappleseed replied to your story.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
