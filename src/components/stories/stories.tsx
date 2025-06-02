"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { StoryViewer } from "./story-viewer"

const stories = [
  { id: 1, username: "Votre story", avatar: "/placeholder.svg?height=60&width=60", isOwn: true, stories: [] },
  {
    id: 2,
    username: "alice_photo",
    avatar: "/placeholder.svg?height=60&width=60",
    stories: [
      { id: 1, image: 'https://i.pinimg.com/736x/b4/ef/e9/b4efe9a7fcf4eaec0d17ec20f9610954.jpg', timeAgo: "2h" },
      { id: 2, image: 'https://ui.lukacho.com/_next/static/media/2.6a8dd51d.webp', timeAgo: "3h" },
      { id: 3, image: "/placeholder.svg?height=800&width=600", timeAgo: "4h" },
    ],
  },
  {
    id: 3,
    username: "bob_travel",
    avatar: "/placeholder.svg?height=60&width=60",
    stories: [
      { id: 1, image: 'https://ui.lukacho.com/_next/static/media/3.d95288b3.webp', timeAgo: "5h" },
      { id: 2, image: 'https://ui.lukacho.com/_next/static/media/4.0de1e023.webp', timeAgo: "6h" },
    ],
  },
]

export function Stories() {
  const [viewingStory, setViewingStory] = useState<number | null>(null)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  const viewableStories = stories.filter((story) => !story.isOwn)

  const handleStoryClick = (storyIndex: number) => {
    if (stories[storyIndex].isOwn) return

    const viewableIndex = viewableStories.findIndex((s) => s.id === stories[storyIndex].id)
    setCurrentUserIndex(viewableIndex)
    setCurrentStoryIndex(0)
    setViewingStory(stories[storyIndex].id)
  }

  const handleNext = () => {
    const currentUser = viewableStories[currentUserIndex]

    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Passer à la story suivante du même utilisateur
      setCurrentStoryIndex((prevIndex) => prevIndex + 1)
    } else if (currentUserIndex < viewableStories.length - 1) {
      // Passer au prochain utilisateur
      setCurrentUserIndex((prevIndex) => prevIndex + 1)
      setCurrentStoryIndex(0)
    } else {
      // Fermer le viewer
      setViewingStory(null)
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      // Revenir à la story précédente du même utilisateur
      setCurrentStoryIndex((prevIndex) => prevIndex - 1)
    } else if (currentUserIndex > 0) {
      // Revenir à l'utilisateur précédent
      setCurrentUserIndex((prevIndex) => {
        const newIndex = prevIndex - 1
        // Utiliser le nouvel index pour obtenir l'utilisateur précédent
        const prevUser = viewableStories[newIndex]
        setCurrentStoryIndex(prevUser.stories.length - 1)
        return newIndex
      })
    }
  }

  const handleClose = () => {
    setViewingStory(null)
  }

  return (
    <>
      <div className="flex gap-4 p-4 overflow-x-auto bg-[var(--bgLevel2)] border-b">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-fit cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className="relative">
              <button
                className={`p-0.5 rounded-full ${story.isOwn ? "bg-[var(--greyHighlighted)]" : "bg-gradient-to-tr from-[var(--pink)] to-[var(--purple)]"}`}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.username} />
                  <AvatarFallback >{story.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </button>
              {story.isOwn && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-[var(--textNeutral)] max-w-16 truncate">{story.username}</span>
          </div>
        ))}
      </div>

      {viewingStory && (
        <StoryViewer
          users={viewableStories}
          currentUserIndex={currentUserIndex}
          currentStoryIndex={currentStoryIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </>
  )
}
