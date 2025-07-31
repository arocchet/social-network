"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryViewer } from "./story-viewer";
import CreateStory from "./createStory";
import AppLoader from "../ui/app-loader";
import { useUserStories } from "@/hooks/use-user-stories";
import type { UserStoriesGroup } from "@/lib/schemas/stories/group";
import { useUser } from "@/hooks/use-user-data";
import { useReactionContext } from "@/app/context/reaction-context";

interface AdaptedStory {
  id: number;
  storyId: string;
  image: string;
  timeAgo: string;
  isLiked?: boolean;
  userReaction?:
    | "LIKE"
    | "DISLIKE"
    | "LOVE"
    | "LAUGH"
    | "SAD"
    | "ANGRY"
    | "WOW"
    | null;
  likesCount?: number;
}

interface AdaptedUser {
  id: number;
  username: string;
  avatar: string;
  isOwn?: boolean;
  stories: AdaptedStory[];
}

export function Stories() {
  const { user: currentUser } = useUser();
  const { storiesGroups, loading, error, refetch } = useUserStories({
    publicOnly: false, // Changer à false pour voir toutes les stories selon les règles de visibilité
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

  const { initializeReactionCount, reactionCounts } = useReactionContext();

  // 👇 CORRECTION : Initialisation des counts dans un useEffect
  useEffect(() => {
    if (!storiesGroups) return;
    storiesGroups.forEach((group) => {
      group.stories.forEach((story) => {
        if (story.id && story._count?.reactions !== undefined) {
          // Utiliser initializeReactionCount pour ne pas écraser les changements locaux
          initializeReactionCount(story.id, story._count.reactions);
        }
      });
    });
  }, [storiesGroups, initializeReactionCount]);

  const adaptStoryData = (storiesGroups: UserStoriesGroup[]): AdaptedUser[] => {
    return storiesGroups.map((group, groupIndex) => ({
      id: groupIndex + 1,
      username:
        group.user.username ||
        `${group.user.firstName} ${group.user.lastName}`.trim(),
      avatar: group.user.avatar || "/placeholder.svg",
      stories: group.stories.map((story, storyIndex) => ({
        id: storyIndex + 1,
        storyId: story.id,
        image: story.media || "/placeholder.svg",
        timeAgo: getTimeAgo(story.datetime),
        isLiked:
          story.reactions?.some(
            (r) => r.type === "LIKE" && r.user.id === currentUser?.id
          ) || false,
        userReaction:
          story.reactions.find((r) => r.user.id === currentUser?.id)?.type ||
          null,
        likesCount: story._count?.reactions ?? 0, // Garde l'initial, le contexte se chargera de la mise à jour
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
    ...adaptStoryData(storiesGroups ?? []),
  ];

  const viewableStories = adaptedStories.filter((story) => !story.isOwn);

  // Vérifier que les indices sont valides avant de rendre le StoryViewer
  const isValidUserIndex =
    currentUserIndex >= 0 && currentUserIndex < viewableStories.length;
  const currentViewingUser = isValidUserIndex
    ? viewableStories[currentUserIndex]
    : null;
  const isValidStoryIndex =
    currentViewingUser &&
    currentStoryIndex >= 0 &&
    currentStoryIndex < currentViewingUser.stories.length;
    
  // Debug logs pour comprendre pourquoi le StoryViewer pourrait disparaître
  console.log('🔍 Render conditions:');
  console.log('  - viewingStory:', viewingStory);
  console.log('  - isValidUserIndex:', isValidUserIndex);
  console.log('  - isValidStoryIndex:', isValidStoryIndex);
  console.log('  - currentStoryIndex:', currentStoryIndex);
  console.log('  - currentViewingUser stories length:', currentViewingUser?.stories?.length);

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
    console.log('🔍 handleNext called - currentUserIndex:', currentUserIndex, 'currentStoryIndex:', currentStoryIndex);
    console.log('🔍 isValidUserIndex:', isValidUserIndex);
    console.log('🔍 viewableStories.length:', viewableStories.length);
    
    if (!isValidUserIndex) {
      console.log('🔍 Invalid user index, closing viewer');
      setViewingStory(null);
      return;
    }

    const currentViewingUser = viewableStories[currentUserIndex];
    console.log('🔍 currentViewingUser:', currentViewingUser);

    // Vérifier que l'utilisateur a des stories
    if (
      !currentViewingUser ||
      !currentViewingUser.stories ||
      currentViewingUser.stories.length === 0
    ) {
      console.log('🔍 No stories for current user, closing viewer');
      setViewingStory(null);
      return;
    }

    console.log('🔍 Navigation logic - currentStoryIndex:', currentStoryIndex, 'stories.length:', currentViewingUser.stories.length);
    
    if (currentStoryIndex < currentViewingUser.stories.length - 1) {
      console.log('🔍 Moving to next story in same user');
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
    } else if (currentUserIndex < viewableStories.length - 1) {
      console.log('🔍 Moving to next user');
      setCurrentUserIndex((prevIndex) => prevIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      console.log('🔍 End of all stories, closing viewer');
      setViewingStory(null);
    }
  };

  const handlePrevious = () => {
    if (!isValidUserIndex) {
      return;
    }

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prevIndex) => prevIndex - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        if (newIndex < 0 || newIndex >= viewableStories.length) {
          return prevIndex;
        }

        const prevUser = viewableStories[newIndex];

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

  if (loading) return <AppLoader />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Erreur: {error}</p>
        <button
          onClick={() => refetch()}
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
          stories={viewableStories}
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
