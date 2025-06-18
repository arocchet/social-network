"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { StoryViewer } from "./story-viewer";
import { useClientDictionary } from "@/app/[locale]/context/dictionnary-context";

const stories = [
  {
    id: 1,
    username: "Votre story",
    avatar: "/placeholder.svg?height=60&width=60",
    isOwn: true,
    stories: [],
  },
  {
    id: 2,
    username: "alice_photo",
    avatar: "/placeholder.svg?height=60&width=60",
    stories: [
      {
        id: 1,
        image:
          "https://pin.it/1kmbO3MXK",
        timeAgo: "2h",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        timeAgo: "3h",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1748199625281-bde664abf23f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        timeAgo: "4h",
      },
    ],
  },
  {
    id: 3,
    username: "bob_travel",
    avatar: "/placeholder.svg?height=60&width=60",
    stories: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        timeAgo: "5h",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
        timeAgo: "6h",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
        timeAgo: "7h",
      },
    ],
  },
  {
    id: 4,
    username: "nature_lover",
    avatar: "/placeholder.svg?height=60&width=60",
    stories: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&h=600&fit=crop",
        timeAgo: "1h",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=800&fit=crop",
        timeAgo: "2h",
      },
    ],
  },
];

export function Stories() {
  const { dict } = useClientDictionary();
  const [viewingStory, setViewingStory] = useState<number | null>(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [viewableStories, setViewableStories] = useState(
    stories.filter((story) => !story.isOwn)
  );

  // Vérifier que les indices sont valides avant de rendre le StoryViewer
  const isValidUserIndex =
    currentUserIndex >= 0 && currentUserIndex < viewableStories.length;
  const currentUser = isValidUserIndex
    ? viewableStories[currentUserIndex]
    : null;
  const isValidStoryIndex =
    currentUser &&
    currentStoryIndex >= 0 &&
    currentStoryIndex < currentUser.stories.length;

  const handleStoryClick = (storyIndex: number) => {
    if (stories[storyIndex].isOwn) return;

    const viewableIndex = viewableStories.findIndex(
      (s) => s.id === stories[storyIndex].id
    );

    // Vérifier que l'index est valide
    if (viewableIndex !== -1) {
      setCurrentUserIndex(viewableIndex);
      setCurrentStoryIndex(0);
      setViewingStory(stories[storyIndex].id);
    }
  };

  const handleNext = () => {
    // Vérifier que l'index utilisateur est valide
    if (!isValidUserIndex) {
      setViewingStory(null);
      return;
    }

    const currentUser = viewableStories[currentUserIndex];

    // Vérifier que l'utilisateur a des stories
    if (
      !currentUser ||
      !currentUser.stories ||
      currentUser.stories.length === 0
    ) {
      setViewingStory(null);
      return;
    }

    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Passer à la story suivante du même utilisateur
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
    } else if (currentUserIndex < viewableStories.length - 1) {
      // Passer au prochain utilisateur
      setCurrentUserIndex((prevIndex) => prevIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      // Fermer le viewer
      setViewingStory(null);
    }
  };

  const handlePrevious = () => {
    // Vérifier que l'index utilisateur est valide
    if (!isValidUserIndex) {
      return;
    }

    if (currentStoryIndex > 0) {
      // Revenir à la story précédente du même utilisateur
      setCurrentStoryIndex((prevIndex) => prevIndex - 1);
    } else if (currentUserIndex > 0) {
      // Revenir à l'utilisateur précédent
      setCurrentUserIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        // Vérifier que le nouvel index est valide
        if (newIndex < 0 || newIndex >= viewableStories.length) {
          return prevIndex;
        }

        // Utiliser le nouvel index pour obtenir l'utilisateur précédent
        const prevUser = viewableStories[newIndex];

        // Vérifier que prevUser existe et a des stories
        if (prevUser && prevUser.stories && prevUser.stories.length > 0) {
          setCurrentStoryIndex(prevUser.stories.length - 1);
        } else {
          setCurrentStoryIndex(0);
        }

        return newIndex;
      });
    }
  };

  const handleClose = () => {
    setViewingStory(null);
  };

  return (
    <>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-fit cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className="relative">
              <button
                className={`p-0.5 rounded-full ${story.isOwn
                    ? "bg-gray-300"
                    : "bg-gradient-to-tr from-[var(--pink)] to-[var(--purple)]"
                  }`}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={story.avatar || "/placeholder.svg"}
                    alt={story.username}
                  />
                  <AvatarFallback>
                    {story.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
              {story.isOwn && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-[var(--neutral)] max-w-16 truncate">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Ne rendre le StoryViewer que si toutes les conditions sont remplies */}
      {viewingStory && isValidUserIndex && isValidStoryIndex && (
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
  );
}
