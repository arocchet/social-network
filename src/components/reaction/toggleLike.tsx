import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { updatedReaction } from "@/hooks/use-reactions";

interface LikeComponentProps {
  contentType: "story" | "post" | "comment";
  content: {
    id?: number | undefined;
    storyId?: string;
    postId?: string;
    commentId?: string;
    isLiked?: boolean;
    likesCount?: number;
  };
}

const LikeComponent = ({ contentType, content }: LikeComponentProps) => {
  const currentContent = {
    storyId:
      contentType === "story" ? content.storyId || content.id : undefined,
    postId: contentType === "post" ? content.postId || content.id : undefined,
    commentId:
      contentType === "comment"
        ? content.commentId || (content.id ? String(content.id) : undefined)
        : undefined,
    isLiked: content.isLiked || false,
    likesCount: content.likesCount || 0,
  };

  const [flyingHearts, setFlyingHearts] = useState<
    Array<{ id: string; x: number; y: number }>
  >([]);
  const [heartId, setHeartId] = useState(0);
  const [isLiked, setIsLiked] = useState(currentContent.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(currentContent.likesCount ?? 0);
  if (currentContent?.storyId) {
    console.log("🔄 LikeComponent - currentContent:", currentContent);
  }

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
            className={`text-xs min-w-[1rem] ${
              contentType === "story"
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
