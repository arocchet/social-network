// src/app/(feed)/settings/notifications/email/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EmailNotificationsSettings() {
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)

  const [emailLikes, setEmailLikes] = useState<'off' | 'following' | 'everyone'>('everyone')
  const [emailComments, setEmailComments] = useState<'off' | 'following' | 'everyone'>('following')
  const [emailFollows, setEmailFollows] = useState<'off' | 'everyone'>('everyone')
  const [emailMentions, setEmailMentions] = useState<'off' | 'following' | 'everyone'>('everyone')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings/notifications" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Email Notifications</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        {/* Global Email Notifications Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-lg">Enable Email Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotificationsEnabled}
              onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          Turn off to stop receiving all email notifications.
        </p>

        {/* Likes Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Likes</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="email-likes"
                id="email-likes-off"
                value="off"
                checked={emailLikes === 'off'}
                onChange={() => setEmailLikes('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-likes-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-likes"
                id="email-likes-following"
                value="following"
                checked={emailLikes === 'following'}
                onChange={() => setEmailLikes('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-likes-following" className="ml-3 text-base">
                From profiles I follow
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-likes"
                id="email-likes-everyone"
                value="everyone"
                checked={emailLikes === 'everyone'}
                onChange={() => setEmailLikes('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-likes-everyone" className="ml-3 text-base">
                From everyone
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            johnappleseed liked your post.
          </p>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Comments</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="email-comments"
                id="email-comments-off"
                value="off"
                checked={emailComments === 'off'}
                onChange={() => setEmailComments('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-comments-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-comments"
                id="email-comments-following"
                value="following"
                checked={emailComments === 'following'}
                onChange={() => setEmailComments('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-comments-following" className="ml-3 text-base">
                From profiles I follow
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-comments"
                id="email-comments-everyone"
                value="everyone"
                checked={emailComments === 'everyone'}
                onChange={() => setEmailComments('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-comments-everyone" className="ml-3 text-base">
                From everyone
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            johnappleseed commented on your photo.
          </p>
        </div>

        {/* New Followers Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">New Followers</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="email-follows"
                id="email-follows-off"
                value="off"
                checked={emailFollows === 'off'}
                onChange={() => setEmailFollows('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-follows-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-follows"
                id="email-follows-everyone"
                value="everyone"
                checked={emailFollows === 'everyone'}
                onChange={() => setEmailFollows('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-follows-everyone" className="ml-3 text-base">
                From everyone
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            johnappleseed started following you.
          </p>
        </div>

        {/* Mentions Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Mentions</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="email-mentions"
                id="email-mentions-off"
                value="off"
                checked={emailMentions === 'off'}
                onChange={() => setEmailMentions('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-mentions-off" className="ml-3 text-base">
                Off
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-mentions"
                id="email-mentions-following"
                value="following"
                checked={emailMentions === 'following'}
                onChange={() => setEmailMentions('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-mentions-following" className="ml-3 text-base">
                From profiles I follow
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="email-mentions"
                id="email-mentions-everyone"
                value="everyone"
                checked={emailMentions === 'everyone'}
                onChange={() => setEmailMentions('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
                disabled={!emailNotificationsEnabled}
              />
              <label htmlFor="email-mentions-everyone" className="ml-3 text-base">
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
