"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { ReactionType } from "@/lib/schemas/reaction";
import {
  LikeIcon,
  DislikeIcon,
  LoveIcon,
  AngryIcon,
  WowIcon,
  ReactionIcon,
  LaughIcon,
  SadIcon,
} from "@/components/reaction/reactionType";
import { cn } from "@/lib/utils";
import {
  DeleteReaction,
  UpdatedReaction,
} from "@/lib/client/reaction/updateReaction";
import { toast } from "sonner";
import { useReactionContext } from "@/app/context/reaction-context";

const reactions = [
  { type: "LIKE", label: "J'aime", icon: LikeIcon },
  { type: "DISLIKE", label: "Dislike", icon: DislikeIcon },
  { type: "LOVE", label: "J'adore", icon: LoveIcon },
  { type: "LAUGH", label: "Haha", icon: LaughIcon },
  { type: "WOW", label: "Wow", icon: WowIcon },
  { type: "SAD", label: "Triste", icon: SadIcon },
  { type: "ANGRY", label: "Grrr", icon: AngryIcon },
];

type ReactionComponentParams = {
  content: ContentParams;
};

type ContentParams = {
  contentId: string;
  reaction: ReactionType | null;
  reactionCount: number;
  reactions?: {
    type: "LIKE" | "DISLIKE" | "LOVE" | "LAUGH" | "SAD" | "ANGRY" | "WOW";
    id: string;
    user: {
      id: string;
      username: string;
    };
  }[];
  type: "stories" | "post" | "comment";
};

export function ReactionComponent({ content }: ReactionComponentParams) {
  const { handleReactionChange, reactionCounts, reactionsData, reactionUpdates, reactionMap, initializeReactionsData } = useReactionContext();
  
  // Use reaction from context if available, otherwise use prop
  const selectedReaction = reactionMap[content.contentId] ?? content.reaction;
  const [localSelectedReaction, setLocalSelectedReaction] = useState<ReactionType | null>(selectedReaction);

  const prevReaction = useRef<ReactionType | null>(content.reaction);
  const [showReactions, setShowReactions] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount and handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.reaction-container')) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  // Initialize reactions data on mount
  useEffect(() => {
    if (content.reactions) {
      initializeReactionsData(content.contentId, content.reactions);
    }
  }, [content.contentId, content.reactions, initializeReactionsData]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 400);
  };

  const handleMainIconClick = () => {
    const newReaction = selectedReaction ? null : "LIKE";
    setLocalSelectedReaction(newReaction);
  };

  const handleReactionSelect = (type: ReactionType) => {
    setLocalSelectedReaction(type);
    setShowReactions(false);
  };

  // Envoie au serveur si la réaction a changé
  useEffect(() => {
    if (localSelectedReaction === prevReaction.current) return;

    const sendReaction = async () => {
      const lastReaction = prevReaction.current;

      // Update context immediately for visual feedback
      handleReactionChange(content.contentId, localSelectedReaction, content.type);

      try {
        if (localSelectedReaction === null) {
          const response = await DeleteReaction(content.contentId);
          if (!response?.success) {
            toast.error("Impossible de supprimer la réaction.");
            setLocalSelectedReaction(lastReaction);
            // Revert context change
            handleReactionChange(content.contentId, lastReaction, content.type);
            return;
          }
        } else {
          console.log(localSelectedReaction, "localSelectedReaction");
          const response = await UpdatedReaction({
            type: localSelectedReaction,
            mediaId: content.contentId,
            contentType: content.type,
          });
          if (!response?.success) {
            toast.error("Impossible d'ajouter la réaction.");
            setLocalSelectedReaction(lastReaction);
            // Revert context change
            handleReactionChange(content.contentId, lastReaction, content.type);
            return;
          }
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        toast.error("Erreur réseau. Réessaye plus tard.");
        setLocalSelectedReaction(lastReaction);
        // Revert context change
        handleReactionChange(content.contentId, lastReaction, content.type);
        return;
      }

      prevReaction.current = localSelectedReaction;
    };

    sendReaction();
  }, [localSelectedReaction, content.contentId, content.type, handleReactionChange]);

  const currentCount =
    reactionCounts[content.contentId] ?? content.reactionCount;

  // Create a dynamic reaction summary that properly handles user's reaction changes
  const reactionSummary = useMemo(() => {
    const baseReactions = content.reactions || [];
    const summary: Record<string, number> = {};
    const originalReaction = content.reaction;
    
    // Count all existing reactions
    baseReactions.forEach(reaction => {
      summary[reaction.type] = (summary[reaction.type] || 0) + 1;
    });
    
    // Now adjust for user's current selection vs original
    if (originalReaction !== selectedReaction) {
      // User changed their reaction or removed it
      
      // Remove original reaction if it existed
      if (originalReaction && summary[originalReaction] > 0) {
        summary[originalReaction] = summary[originalReaction] - 1;
        if (summary[originalReaction] === 0) {
          delete summary[originalReaction];
        }
      }
      
      // Add new reaction if user selected one
      if (selectedReaction) {
        summary[selectedReaction] = (summary[selectedReaction] || 0) + 1;
      }
    }
    
    return summary;
  }, [content.reactions, selectedReaction, content.reaction]);

  // Force re-render when reactionUpdates changes
  const _ = reactionUpdates[content.contentId];

  // Get top 3 most popular reactions
  const topReactions = Object.entries(reactionSummary)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="relative group reaction-container">
      <div className="flex items-center gap-2">
        {/* Show top reactions or user's selected reaction */}
        <div
          className="flex items-center gap-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {topReactions.length > 0 ? (
            // Show popular reactions
            <div className="flex items-center gap-0.5">
              {topReactions.map(([type, count]) => {
                const Icon = ReactionIcon[type as keyof typeof ReactionIcon];
                return Icon && typeof Icon === "function" ? (
                  <div key={type} className="relative">
                    <Icon size={20} className="drop-shadow-sm" />
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            // Fallback to user's reaction or default like button
            (() => {
              const Icon =
                ReactionIcon[selectedReaction as keyof typeof ReactionIcon] ||
                ReactionIcon.LIKE;

              return typeof Icon === "function" ? (
                <button
                  type="button"
                  onClick={handleMainIconClick}
                  className="cursor-pointer"
                  aria-label="Toggle reaction"
                >
                  <Icon
                    size={24}
                    className="transition-all duration-200 cursor-pointer mt-0.5"
                    {...(!selectedReaction ? { fill: "transparent" } : {})}
                  />
                </button>
              ) : (
                Icon
              );
            })()
          )}
        </div>

        {/* Reaction count */}
        {currentCount > 0 && (
          <span className="text-xs text-muted-foreground">{currentCount}</span>
        )}
      </div>

      {showReactions && (
        <div
          className={
            content.type === "comment"
              ? "absolute left-9 top-1/2 -translate-y-1/2 ml-2 flex gap-2 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] p-2 rounded-xl shadow-lg z-50 animate-fade-in"
              : content.type === "stories"
              ? "absolute bottom-full left-1/2 -translate-x-41 flex gap-2 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] p-2 rounded-xl shadow-lg z-50 animate-fade-in"
              : "absolute bottom-full left-1/2 -translate-x-5 flex gap-2 bg-[var(--bgLevel1)] border border-[var(--detailMinimal)] p-2 rounded-xl shadow-lg z-50 animate-fade-in"
          }
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {reactions.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              title={label}
              onClick={() => handleReactionSelect(type as ReactionType)}
              className={cn(
                "text-2xl transition-transform cursor-pointer text-[var(--textNeutral)]",
                "hover:scale-125 hover:text-[var(--blue)]",
                {
                  "text-[var(--blue)]": selectedReaction === type,
                  "text-[var(--textMinimal)]": selectedReaction !== type,
                }
              )}
            >
              {typeof Icon === "function" ? <Icon size={24} /> : Icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
