// src/app/(feed)/settings/notifications/push/page.tsx
'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PushNotificationsSettings() {
  const [pauseAll, setPauseAll] = useState(false)
  const [likes, setLikes] = useState<'off' | 'following' | 'everyone'>('everyone')
  const [likesAndCommentsOnYourPhotos, setLikesAndCommentsOnYourPhotos] = useState<'off' | 'following' | 'everyone'>('following')
  const [comments, setComments] = useState<'off' | 'following' | 'everyone'>('everyone')
  const [commentLikes, setCommentLikes] = useState<'off' | 'on'>('on')
  const [stickerResponses, setStickerResponses] = useState<'off' | 'on'>('on')
  const [commentDailyDigest, setCommentDailyDigest] = useState<'off' | 'on'>('off')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16 pb-8">
      <header className="flex items-center px-6 mb-6">
        <Link href="/settings/notifications" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-semibold">Push Notifications</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <span className="text-lg">Push notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pauseAll}
              onChange={() => setPauseAll(!pauseAll)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-gray-500 peer-focus:ring-2 peer-focus:ring-gray-400 transition"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
          </label>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Likes</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="likes"
                id="likes-off"
                value="off"
                checked={likes === 'off'}
                onChange={() => setLikes('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="likes-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="likes"
                id="likes-following"
                value="following"
                checked={likes === 'following'}
                onChange={() => setLikes('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="likes-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="likes"
                id="likes-everyone"
                value="everyone"
                checked={likes === 'everyone'}
                onChange={() => setLikes('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="likes-everyone" className="ml-3 text-base">From everyone</label>
            </div>
            <p className="text-sm text-gray-400">johnappleseed liked your photo.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Likes and comments on photos of you</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="likes-comments"
                id="lc-off"
                value="off"
                checked={likesAndCommentsOnYourPhotos === 'off'}
                onChange={() => setLikesAndCommentsOnYourPhotos('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="lc-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="likes-comments"
                id="lc-following"
                value="following"
                checked={likesAndCommentsOnYourPhotos === 'following'}
                onChange={() => setLikesAndCommentsOnYourPhotos('following')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="lc-following" className="ml-3 text-base">From profiles I follow</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="likes-comments"
                id="lc-everyone"
                value="everyone"
                checked={likesAndCommentsOnYourPhotos === 'everyone'}
                onChange={() => setLikesAndCommentsOnYourPhotos('everyone')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="lc-everyone" className="ml-3 text-base">From everyone</label>
            </div>
            <p className="text-sm text-gray-400">johnappleseed commented on a post you’re tagged in.</p>
          </div>
        </div>

        <div className="space-y-6">
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
            <p className="text-sm text-gray-400">johnappleseed commented: “Nice shot!”</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Comment likes</h2>
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
            <p className="text-sm text-gray-400">johnappleseed liked your comment: Nice shot!</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Sticker responses</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="sticker-responses"
                id="sticker-responses-off"
                value="off"
                checked={stickerResponses === 'off'}
                onChange={() => setStickerResponses('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="sticker-responses-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="sticker-responses"
                id="sticker-responses-on"
                value="on"
                checked={stickerResponses === 'on'}
                onChange={() => setStickerResponses('on')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="sticker-responses-on" className="ml-3 text-base">On</label>
            </div>
            <p className="text-sm text-gray-400">You have new responses to your poll sticker.</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-medium">Comment daily digest</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="comment-digest"
                id="comment-digest-off"
                value="off"
                checked={commentDailyDigest === 'off'}
                onChange={() => setCommentDailyDigest('off')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comment-digest-off" className="ml-3 text-base">Off</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="comment-digest"
                id="comment-digest-on"
                value="on"
                checked={commentDailyDigest === 'on'}
                onChange={() => setCommentDailyDigest('on')}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600"
              />
              <label htmlFor="comment-digest-on" className="ml-3 text-base">On</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
