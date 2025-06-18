"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryViewer } from "./story-viewer";
import { UserStoriesGroup, useUserStories } from "@/hooks/use-user-stories";
import CreateStory from "./createStory";
// Interface pour adapter vos données aux composants existants
interface AdaptedStory {
  id: number;
  image: string;
  timeAgo: string;
}

interface AdaptedUser {
  id: number;
  username: string;
  avatar: string;
  isOwn?: boolean;
  stories: AdaptedStory[];
}

export function Stories() {
  const { storiesGroups, loading, error, refetch } = useUserStories({
    publicOnly: true,
    includeExpired: false,
  });

  const [viewingStory, setViewingStory] = useState<number | null>(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Fonction pour calculer le temps écoulé
  const getTimeAgo = (datetime: string) => {
    const now = new Date();
    const storyDate = new Date(datetime);
    const diffInMinutes = Math.floor(
      (now.getTime() - storyDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h`;
    }
  };

  // Adapter les données de la base de données au format attendu par les composants
  const adaptStoryData = (storiesGroups: UserStoriesGroup[]): AdaptedUser[] => {
    return storiesGroups.map((group, groupIndex) => ({
      id: groupIndex + 1, // Index temporaire
      username:
        group.user.username ||
        `${group.user.firstName} ${group.user.lastName}`.trim(),
      avatar: group.user.avatar || "/placeholder.svg",
      stories: group.stories.map((story, storyIndex) => ({
        id: storyIndex + 1,
        image: story.media || "/placeholder.svg",
        timeAgo: getTimeAgo(story.datetime),
      })),
    }));
  };

  // Ajouter la story "Votre story" au début
  const adaptedStories: AdaptedUser[] = [
    {
      id: 0,
      username: "Votre story",
      avatar: "/placeholder.svg?height=60&width=60",
      isOwn: true,
      stories: [],
    },
    ...adaptStoryData(storiesGroups),
  ];

  const viewableStories = adaptedStories.filter((story) => !story.isOwn);

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
    if (adaptedStories[storyIndex].isOwn) return;

    const viewableIndex = viewableStories.findIndex(
      (s) => s.id === adaptedStories[storyIndex].id
    );

    // Vérifier que l'index est valide
    if (viewableIndex !== -1) {
      setCurrentUserIndex(viewableIndex);
      setCurrentStoryIndex(0);
      setViewingStory(adaptedStories[storyIndex].id);
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

  if (loading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        {/* Skeleton pour le chargement */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1 min-w-fit"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Erreur: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {adaptedStories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-fit cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className="relative">
              <button
                className={`p-0.5 rounded-full ${
                  story.isOwn
                    ? "bg-gray-300"
                    : story.stories.length > 0
                    ? "bg-gradient-to-tr from-[var(--pink)] to-[var(--purple)]"
                    : "bg-gray-300"
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
                <div className="absolute -bottom-0 -right-0  flex items-center justify-center border-2 border-white">
                  <CreateStory onStoryCreated={refetch} />
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
