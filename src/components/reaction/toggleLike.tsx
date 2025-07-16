import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { updatedReaction } from "@/hooks/use-reactions";
import { ReactionType } from "@/lib/schemas/reaction";
import { LikeIcon, DislikeIcon, LoveIcon, AngryIcon, WowIcon, ReactionIcon, LaughIcon, SadIcon } from "@/components/reaction/reactionType";
import { cn } from "@/lib/utils";
import { DeleteReaction, UpdatedReaction } from "@/lib/client/reaction/updateReaction";
import { toast } from "sonner";
import { useReactionContext } from "@/app/context/reaction-context";

interface LikeComponentProps {
  contentType: "story" | "post" | "comment";
  content: {
    id?: number | undefined;
    storyId?: string;
    postId?: string;
    commentId?: string;
    isLiked?: ReactionType | null | undefined;
    likesCount?: number;
  };
}

/**
 * @deprecated Use Reaction component instead of Like component
 * 
 * 
 */
const LikeComponent = ({ contentType, content }: LikeComponentProps) => {
  const currentContent = {
    storyId:
      contentType === "story" ? content.storyId || content.id : undefined,
    postId: contentType === "post" ? content.postId || content.id : undefined,
    commentId:
      contentType === "comment"
        ? content.commentId || (content.id ? String(content.id) : undefined)
        : undefined,
    isLiked: content.isLiked || null,
    likesCount: content.likesCount || 0,
  };

  const [flyingHearts, setFlyingHearts] = useState<
    Array<{ id: string; x: number; y: number }>
  >([]);
  const [heartId, setHeartId] = useState(0);
  const [isLiked, setIsLiked] = useState(currentContent.isLiked === "LIKE");
  const [likesCount, setLikesCount] = useState(currentContent.likesCount ?? 0);
  if (currentContent?.storyId) {
    console.log("🔄 LikeComponent - currentContent:", currentContent);
  }

  console.log("isLked: ", { isLiked })

  const apiContentType =
    contentType === "story"
      ? "stories"
      : contentType === "post"
        ? "post"
        : "comment";

  const toggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    if (!currentContent) return;

    console.log(
      "🔄 AVANT - isLiked:",
      isLiked,
      "contentType:",
      contentType,
      "storyId:",
      currentContent.storyId,
      "postId:",
      currentContent.postId,
      "commentId:",
      currentContent.commentId
    );

    try {
      // ✅ Pour TOUS les types - appel API normal
      let mediaId: string | number;
      if (contentType === "story") {
        mediaId = currentContent.storyId!;
      } else if (contentType === "post") {
        mediaId = currentContent.postId!;
      } else if (contentType === "comment") {
        mediaId = currentContent.commentId!; // ✅ Commentaires aussi !
      } else {
        throw new Error(`Type de contenu non supporté: ${contentType}`);
      }

      // ✅ Vérification que mediaId existe
      if (!mediaId) {
        console.error(`❌ mediaId manquant pour ${contentType}`);
        return;
      }

      console.log(`💾 ${contentType} like - Appel API avec mediaId:`, mediaId);

      const response = await updatedReaction({
        type: isLiked ? "DISLIKE" : "LIKE",
        mediaId: mediaId,
        contentType: apiContentType, // ✅ "stories", "post", ou "comment"
      });

      console.log("📥 RÉPONSE API:", response);
      console.log(`${contentType}Id:`, mediaId);

      if (response && response.success) {
        const newLikedState = !isLiked;
        const newLikesCount = newLikedState
          ? likesCount + 1
          : Math.max(0, likesCount - 1);

        // ✅ MISE À JOUR DES STATES
        setIsLiked(newLikedState);
        setLikesCount(newLikesCount);

        // ✅ CACHE (pour tous les types)
        const cacheKey =
          contentType === "story"
            ? currentContent.storyId
            : contentType === "post"
              ? currentContent.postId
              : currentContent.commentId;

        console.log(
          "✅ UPDATE - newLikedState:",
          newLikedState,
          "ancien likesCount:",
          likesCount,
          "nouveau likesCount:",
          newLikesCount,
          "contentType:",
          contentType
        );

        // ✅ Animation coeur volant pour TOUS les types
        if (newLikedState) {
          const newHeart = {
            id: `heart-${heartId}-${Date.now()}`,
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
  return (
    <>
      {/* ✅ Hearts volants SÉPARÉS avec position fixed */}
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

      {/* ✅ Bouton like NORMAL (pas fixed) */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={
            contentType === "story"
              ? "text-white hover:bg-white/20"
              : "text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)]"
          }
          onClick={toggleLike}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
        {likesCount > 0 && (
          <span
            className={`text-xs min-w-[1rem] ${contentType === "story"
              ? "text-white/80"
              : "text-[var(--textNeutral)]"
              }`}
          >
            {likesCount}
          </span>
        )}
      </div>
    </>
  );
};
export default LikeComponent;

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
  content: ContentParams
}

type ContentParams = {
  contentId: string;
  reaction: ReactionType | null;
  reactionCount: number
  type: "stories" | "post" | "comment";
}

export function ReactionComponent({ content }: ReactionComponentParams) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(content.reaction);
  const prevReaction = useRef<ReactionType | null>(content.reaction);

  const { handleReactionChange } = useReactionContext()

  const [showReactions, setShowReactions] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 150);
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
            setSelectedReaction(lastReaction); // rollback
          }
        } else {
          const response = await UpdatedReaction({
            type: selectedReaction,
            mediaId: content.contentId,
            contentType: content.type,
          });
          if (!response?.success) {
            toast.error("Impossible d'ajouter la réaction.");
            setSelectedReaction(lastReaction); // rollback
          }
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        toast.error("Erreur réseau. Réessaye plus tard.");
        setSelectedReaction(lastReaction); // rollback
      } finally {
        handleReactionChange(content.contentId, selectedReaction)
      }

      prevReaction.current = selectedReaction;
    };

    sendReaction();
  }, [selectedReaction, content.contentId, content.type]);


  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-1">
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
                size={36}
                className="transition-all duration-200 cursor-pointer"
                {...(!selectedReaction ? { fill: 'transparent' } : {})}
              />
            </button>
          ) : (
            Icon
          );
        })()}
      </div>

      {showReactions && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 flex gap-2 bg-white dark:bg-zinc-800 border p-2 rounded-xl shadow-lg z-50 animate-fade-in">
          {reactions.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              title={label}
              onClick={() => handleReactionSelect(type as ReactionType)}
              className={cn(
                "text-2xl transition-transform cursor-pointer",
                "hover:scale-125",
                {
                  "fill-blue-600": selectedReaction === type,
                  "fill-neutral-50 hover:fill-[var(--blue90)]":
                    selectedReaction !== type,
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
