import { useMemo, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX } from "lucide-react";
import { getMediaType } from "@/app/utils/media";
import { StoryMedia } from "./storyMedia";
import { useStoryPlayback } from "@/hooks/use-story-playback";
import { ReactionComponent } from "../reaction/toggleLike";
import { useReactionContext } from "@/app/context/reaction-context";

interface Reaction {
  id: string;
  userId: string;
  type: "LIKE" | "DISLIKE" | "LOVE" | "LAUGH" | "SAD" | "ANGRY" | "WOW";
  user?: {
    id: string;
    username: string;
  };
}

interface StoryContent {
  id: number;
  storyId: string;
  image: string;
  timeAgo: string;
  mediaType?: "image" | "video";
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
  Reaction?: Reaction[];
  likesCount?: number;
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
  const [dominantColor, setDominantColor] = useState("#000000");

  // ✅ RÉCUPÉRER LES FONCTIONS DU CONTEXT
  const { reactionMap, reactionCounts, initializeReactionCount } =
    useReactionContext();

  const isValidUserIndex = useMemo(
    () => currentUserIndex >= 0 && currentUserIndex < stories.length,
    [currentUserIndex, stories.length]
  );

  const currentUser = useMemo(
    () => (isValidUserIndex ? stories[currentUserIndex] : null),
    [isValidUserIndex, stories, currentUserIndex]
  );

  const isValidStoryIndex = useMemo(
    () =>
      currentUser &&
      currentStoryIndex >= 0 &&
      currentStoryIndex < currentUser.stories.length,
    [currentUser, currentStoryIndex]
  );

  const currentStoryContent = useMemo(
    () =>
      isValidStoryIndex && currentUser
        ? currentUser.stories[currentStoryIndex]
        : null,
    [isValidStoryIndex, currentUser, currentStoryIndex]
  );

  useEffect(() => {
    if (
      currentStoryContent?.storyId &&
      currentStoryContent?.likesCount !== undefined
    ) {
      initializeReactionCount(
        currentStoryContent.storyId,
        currentStoryContent.likesCount
      );
    }
  }, [currentStoryContent?.storyId, initializeReactionCount]);

  const mediaType = useMemo(
    () =>
      currentStoryContent
        ? currentStoryContent.mediaType ||
        getMediaType(currentStoryContent.image)
        : "image",
    [currentStoryContent]
  );

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

  enum ContentType {
    STORY = "stories",
    POST = "post",
    COMMENT = "comment",
  }

  const reactionContent = useMemo(
    () => ({
      contentId: currentStoryContent.storyId,
      reaction:
        reactionMap[currentStoryContent.storyId] ??
        currentStoryContent?.userReaction ??
        null,
      reactionCount:
        reactionCounts[currentStoryContent.storyId] ??
        currentStoryContent.likesCount ??
        0,
      reactions: currentStoryContent?.Reaction
        ? currentStoryContent.Reaction.filter(r => r.user)
          .map(r => ({
            type: r.type,
            id: r.id,
            user: r.user!, // user is guaranteed here
          }))
        : undefined,
      type: ContentType.STORY,
    }),
    [currentStoryContent, reactionMap, reactionCounts]
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
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

            <ReactionComponent
              key={currentStoryContent.storyId}
              content={reactionContent}
            />

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
