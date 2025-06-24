"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX, Heart } from "lucide-react";
import { getMediaType } from "@/app/utils/media";
import { StoryMedia } from "./storyMedia";
import { useStoryPlayback } from "@/hooks/use-story-playback";
import { storiesReaction } from "@/lib/client/stories/storiesReaction";

interface StoryContent {
  id: number;
  storyId: string;
  image: string;
  timeAgo: string;
  mediaType?: "image" | "video";
}

interface Story {
  id: number;
  username: string;
  avatar: string;
  stories: StoryContent[];
}

interface StoryViewerProps {
  stories: Story[];
  currentUserIndex: number;
  currentStoryIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function StoryViewer({
  stories,
  currentUserIndex,
  currentStoryIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  const [dominantColor, setDominantColor] = useState<string>("#000000");
  const [isLiked, setIsLiked] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [heartId, setHeartId] = useState(0);

  const isValidUserIndex =
    currentUserIndex >= 0 && currentUserIndex < stories.length;
  const currentUser = isValidUserIndex ? stories[currentUserIndex] : null;
  const isValidStoryIndex =
    currentUser &&
    currentStoryIndex >= 0 &&
    currentStoryIndex < currentUser.stories.length;
  const currentStoryContent =
    isValidStoryIndex && currentUser
      ? currentUser.stories[currentStoryIndex]
      : null;
  const mediaType = currentStoryContent
    ? currentStoryContent.mediaType || getMediaType(currentStoryContent.image)
    : "image";

  const {
    progress,
    isPaused,
    isMuted,
    mediaLoaded,
    error,
    imageRef,
    videoRef,
    toggleMute,
    handleImageLoad,
    handleVideoLoad,
    handleMediaError,
  } = useStoryPlayback({
    mediaType,
    onNext,
    currentStoryContent,
    setDominantColor,
  });

  useEffect(() => {
    if (!isValidUserIndex || !isValidStoryIndex) {
      onClose();
    }
  }, [isValidUserIndex, isValidStoryIndex, onClose]);

  const handleTap = (e: React.MouseEvent) => {
    if (isPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    x < width / 2 ? onPrevious() : onNext();
  };

  const toggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const currentStory = stories
      .flatMap((group) => group.stories)
      .find((story) => story.id === currentStoryIndex + 1);

    if (!currentStoryContent) return;

    try {
      const response = await storiesReaction({
        type: isLiked ? "DISLIKE" : "LIKE",
        storyId: currentStoryContent?.storyId,
      });

      console.log("response: ", response);
      if (response && response.status === 200) {
        setIsLiked((prev) => !prev);

        if (!isLiked) {
          const rect = event.currentTarget.getBoundingClientRect();
          const newHeart = {
            id: heartId,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          setFlyingHearts((prev) => [...prev, newHeart]);
          setHeartId((prev) => prev + 1);
          setTimeout(() => {
            setFlyingHearts((prev) =>
              prev.filter((heart) => heart.id !== newHeart.id)
            );
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like :", error);
    }
  };

  if (error || !currentUser || !currentStoryContent) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p className="mb-4">{"Impossible de charger cette story"}</p>
            <Button onClick={onClose} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {flyingHearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-[60]"
          style={{
            left: heart.x - 12,
            top: heart.y - 12,
            animation: "heartFly 1s ease-out forwards",
          }}
        >
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
        </div>
      ))}

      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: dominantColor,
          opacity: mediaLoaded ? 0.8 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex gap-1 p-4">
          {currentUser.stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.username}
              />
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold text-sm text-white">
                {currentUser.username}
              </span>
              <span className="text-xs text-white/70 ml-2">
                {currentStoryContent.timeAgo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleLike}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            {mediaType === "video" && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative px-4 min-h-0" onClick={handleTap}>
          <div className="w-full h-full flex items-center justify-center min-h-0">
            <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
              <StoryMedia
                src={currentStoryContent.image}
                type={mediaType}
                muted={isMuted}
                loaded={mediaLoaded}
                setRef={(el) => {
                  if (mediaType === "image")
                    imageRef.current = el as HTMLImageElement;
                  else videoRef.current = el as HTMLVideoElement;
                }}
                onLoad={
                  mediaType === "image" ? handleImageLoad : handleVideoLoad
                }
                onError={handleMediaError}
              />
              {!mediaLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex">
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-l-lg" />
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-r-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
