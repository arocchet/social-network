"use client";

import { useEffect, useRef, useState } from "react";
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
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(
    content.reaction
  );

  const prevReaction = useRef<ReactionType | null>(content.reaction);
  const { handleReactionChange, reactionCounts } = useReactionContext();
  const [showReactions, setShowReactions] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    setSelectedReaction((prev) => (prev ? null : "LIKE"));
  };

  const handleReactionSelect = (type: ReactionType) => {
    setSelectedReaction(type);
    setShowReactions(false);
  };

  // Envoie au serveur si la réaction a changé
  useEffect(() => {
    if (selectedReaction === prevReaction.current) return;

    const sendReaction = async () => {
      const lastReaction = prevReaction.current;

      try {
        if (selectedReaction === null) {
          const response = await DeleteReaction(content.contentId);
          if (!response?.success) {
            toast.error("Impossible de supprimer la réaction.");
            setSelectedReaction(lastReaction);
            return;
          }
        } else {
          console.log(selectedReaction, "selectedReaction");
          const response = await UpdatedReaction({
            type: selectedReaction,
            mediaId: content.contentId,
            contentType: content.type,
          });
          if (!response?.success) {
            toast.error("Impossible d'ajouter la réaction.");
            setSelectedReaction(lastReaction);
            return;
          }
        }
        
        // ✅ Appeler handleReactionChange seulement si la requête a réussi
        handleReactionChange(content.contentId, selectedReaction, content.type);
      } catch (error) {
        console.error("Erreur réseau :", error);
        toast.error("Erreur réseau. Réessaye plus tard.");
        setSelectedReaction(lastReaction);
      }

      prevReaction.current = selectedReaction;
    };

    sendReaction();
  }, [selectedReaction, content.contentId, content.type]);

  const currentCount =
    reactionCounts[content.contentId] ?? content.reactionCount;

  return (
    <div className="relative group">
      <div className="flex  items-center gap-2">
        {/* Icône de réaction */}
        <div
          className="flex items-center gap-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {(() => {
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
          })()}
        </div>

        {/* ✅ Compteur de réactions - utilise le contexte */}
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