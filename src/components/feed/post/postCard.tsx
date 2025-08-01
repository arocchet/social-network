"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Bookmark, Play, Video, MessageCircle } from "lucide-react";
import { PostDetails } from "./postDetails";
import Link from "next/link";
import { usePostContext } from "@/app/context/post-context";
import type { Post } from "@/lib/schemas/post";
import { ReactionComponent } from "@/components/reaction/toggleLike";
import { useReactionContext } from "@/app/context/reaction-context";

interface PostContent {
  isLiked?: boolean;
  likesCount?: number;
}

const PostCard = ({ isLiked, likesCount }: PostContent) => {
  const { allposts } = usePostContext();
  const { reactionCounts } = useReactionContext();

  console.log("PostCard:", allposts[0]?.reactions);

  // Etat pour gérer quel post a ses détails ouverts
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  // Fonction pour détecter le type de média
  const getMediaType = (mediaUrl: string | null) => {
    if (!mediaUrl) return "text";

    if (mediaUrl.includes("/video/") || mediaUrl.includes("video"))
      return "video";
    if (mediaUrl.includes("/image/") || mediaUrl.includes("image"))
      return "image";

    const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".flv"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    const lowerUrl = mediaUrl.toLowerCase();

    if (videoExtensions.some((ext) => lowerUrl.includes(ext))) return "video";
    if (imageExtensions.some((ext) => lowerUrl.includes(ext))) return "image";

    return "image";
  };

  // Composant pour afficher le média d'un post
  const PostMedia = ({ post }: { post: Post }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const mediaType = getMediaType(post.image);

    const handleVideoPlay = (e: React.MouseEvent<HTMLVideoElement>) => {
      e.stopPropagation();
      const video = e.target as HTMLVideoElement;
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    if (mediaType === "video" && post.image) {
      return (
        <div className="relative aspect-square border-b border-[var(--detailMinimal)]">
          <video
            src={post.image}
            className="w-full h-full object-cover"
            controls
            loop
            onClick={handleVideoPlay}
            onEnded={() => setIsPlaying(false)}
          />

        </div>
      );
    }

    if (mediaType === "image") {
      return (
        <div className="relative aspect-square border-b border-[var(--detailMinimal)]">
          <img
            src={post.image || "https://via.placeholder.com/400x400?text=Image"}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="relative min-h-[200px] border-b border-[var(--detailMinimal)] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-center h-full p-6">
          <p className="text-center text-lg font-medium text-[var(--textNeutral)] leading-relaxed">
            {post.message || "Post sans contenu"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {allposts.map((post, index) => (
        <div
          key={post.id || index}
          className="self-center w-[95%] max-w-lg bg-[var(--bgLevel2)] border rounded-2xl border-[var(--detailMinimal)]"
        >
          {/* Header du post */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)]">
            <Link href={`/profile/${post.user.id}`}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={post.user?.avatar || post.user.avatar}
                    alt={post.user?.username || post.user.username}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[var(--greyFill)] text-[var(--textNeutral)]">
                    {(post.user?.username ||
                      post.user.username ||
                      "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-[var(--textNeutral)]">
                    {post.user?.username || post.user.username || "Utilisateur"}
                  </span>
                  {post.user?.firstName && post.user?.lastName && (
                    <span className="text-xs text-[var(--textMinimal)]">
                      {post.user.firstName} {post.user.lastName}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Média du post */}
          <PostMedia post={post} />

          {/* Actions et contenu */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <ReactionComponent
                  content={{
                    contentId: post.id,
                    reaction: post?.reactions[0]?.type || null,
                    reactionCount:
                      reactionCounts[post.id] ?? post._count.reactions ?? 0,
                    reactions: post?.reactions,
                    type: "post",
                  }}
                />
                {/* Bouton pour ouvrir les détails / commentaires */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 hover:bg-transparent"
                  onClick={() => setOpenPostId(post.id)}
                >
                  <MessageCircle className="w-6 h-6 text-[var(--textNeutral)] hover:text-blue-500 transition-colors" />
                </Button>
              </div>
            </div>

            {/* Caption - seulement si ce n'est pas un post texte */}
            {post.image && (
              <div className="text-sm text-[var(--textNeutral)] mb-2">
                <span className="font-semibold mr-2">
                  {post.user?.username || post.user.username}
                </span>
                {post.message || "Une belle publication partagée !"}
              </div>
            )}

            {/* Commentaires - juste le compteur avec bouton */}
            {post._count.comments > 0 && (
              <button
                className="text-sm text-[var(--textMinimal)] mb-2 hover:underline"
                onClick={() => setOpenPostId(post.id)}
              >
                Voir les {post._count.comments} commentaires
              </button>
            )}

            {/* Time */}
            <div className="text-xs text-[var(--textMinimal)] uppercase">
              {post.datetime
                ? new Date(post.datetime).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : `Il y a ${Math.floor(Math.random() * 24)}h`}
            </div>
          </div>
        </div>
      ))}

      {/* Rendu conditionnel du PostDetails seulement si openPostId est défini */}
      {openPostId && (
        <PostDetails postId={openPostId} onClose={() => setOpenPostId(null)} />
      )}
    </div>
  );
};

export default PostCard;
