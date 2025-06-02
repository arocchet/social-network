"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Heart, Send, MoreHorizontal } from "lucide-react"
import Image from "next/image"

interface StoryContent {
  id: number
  image: string
  timeAgo: string
}

interface Story {
  id: number
  username: string
  avatar: string
  stories: StoryContent[]
}

interface StoryViewerProps {
  users: Story[]
  currentUserIndex: number
  currentStoryIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function StoryViewer({
  users,
  currentUserIndex,
  currentStoryIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const currentUser = users[currentUserIndex]
  const currentStoryContent = currentUser.stories[currentStoryIndex]
  const totalStoriesForUser = currentUser.stories.length

//   useEffect(() => {
//     setProgress(0)
//     const timer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           // Utiliser setTimeout pour éviter de mettre à jour l'état pendant le rendu
//           setTimeout(() => {
//             onNext()
//           }, 0)
//           return 100 // Maintenir à 100% jusqu'à ce que onNext() soit appelé
//         }
//         return prev + 2
//       })
//     }, 100)

//     return () => clearInterval(timer)
//   }, [currentStoryIndex, onNext])

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 2) {
      onPrevious()
    } else {
      onNext()
    }
  }

  return (
    <div className="fixed inset-0 bg-[var(--bgLevel2)] z-50 flex flex-col">
      {/* Progress bars */}
      <div className="flex gap-1 p-2">
        {currentUser.stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-[var(--bgLevel4)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--neutral)] transition-all duration-100 ease-linear"
              style={{
                width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-[var(--textNeutral)] border-b border-[var(--detailMinimal)]">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 border-2 border-white">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-sm">{currentUser.username}</span>
            <span className="text-xs text-[var(--textMinimal)] ml-2">{currentStoryContent.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <Button variant="ghost" size="icon" className="text-[var(--textMinimal)]" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Story content */}
      <div className="flex-1 relative self-center" onClick={handleTap}>
        <img
          src={currentStoryContent.image || "/placeholder.svg"}
          alt="Story"
          className="object-cover"
        />

        {/* Tap areas indicators (only visible on hover) */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 hover:bg-black/10 transition-colors" />
          <div className="flex-1 hover:bg-black/10 transition-colors" />
        </div>
      </div>

      {/* Bottom input */}
      {/* <div className="p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Répondre à cette story..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent border-white/30 text-white placeholder:text-gray-300 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  )
}
