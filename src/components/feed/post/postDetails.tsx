"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InputComment from "../../comments/InputComment";
import { Skeleton } from "@/components/ui/skeleton";
import { PostWithDetails } from "@/lib/schemas/post/";
import { Comment } from "@/lib/schemas/comment";
import { usePostById } from "@/hooks/use-post-by-id";
import { ReactionComponent } from "@/components/reaction/toggleLike";
import { useReactionContext } from "@/app/context/reaction-context";

interface PostDetailsProps {
  postId: string;
  trigger?: React.ReactNode;
  onClose: () => void;
}

function PostDetails({ postId, trigger, onClose }: PostDetailsProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [updatedPost, setUpdatedPost] = useState<PostWithDetails>();
  const contentRef = useRef<HTMLDivElement>(null);

  const { post, loading } = usePostById(postId);

  // ✅ AJOUTER CES 2 LIGNES
  const { initializeReactionCount } = useReactionContext();

  useEffect(() => {
    if (post?.id && post._count?.reactions !== undefined) {
      initializeReactionCount(post.id, post._count.reactions);
    }
  }, [post?.id]);

  useEffect(() => {
    setUpdatedPost(post);
    console.log("post: ", post);
  }, [post]);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;
    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  const handleNewComment = (newComment: Comment) => {
    setUpdatedPost((prev) =>
      prev
        ? {
            ...prev,
            comments: [newComment, ...prev.comments],
          }
        : prev
    );
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="p-0 relative">
            <MessageCircle className="w-6 h-6" />
            {post && post._count?.comments > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {post._count.comments > 99 ? "99+" : post._count.comments}
              </span>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-5xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-50">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="sr-only">Commentaires du post</DialogTitle>
          <DialogDescription asChild>
            <div className="flex h-[80vh] max-h-[83vh] w-full rounded-md overflow-hidden">
              {!loading && updatedPost ? (
                <div className="flex w-full h-full">
                  <MediaSection post={updatedPost} />
                  <div className="flex flex-col w-[500px] bg-[var(--bgLevel1)] border-l border-[var(--detailMinimal)]">
                    <PostHeader post={updatedPost} />
                    <div
                      ref={contentRef}
                      onScroll={handleScroll}
                      className="flex-1 overflow-y-auto "
                    >
                      <CommentsSection comments={updatedPost?.comments} />
                    </div>
                    <PostFooter
                      postId={postId}
                      onCommentAdded={handleNewComment}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Composant de chargement avec skeleton style Instagram
export function LoadingState() {
  return (
    <div className="flex w-full h-full">
      {/* Skeleton média - gauche */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Skeleton commentaires - droite */}
      <div className="flex flex-col w-96 bg-[var(--bgLevel1)] border-l border-[var(--detailMinimal)]">
        {/* Header skeleton */}
        <div className="flex-shrink-0 bg-[var(--bgLevel2)] border-b border-[var(--detailMinimal)]">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        </div>

        {/* Commentaires skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
                <div className="ml-11 space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex-shrink-0 bg-[var(--bgLevel2)] border-t border-[var(--detailMinimal)]">
          <div className="p-2">
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant d'erreur
export function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <p className="text-sm text-muted-foreground">
          Erreur lors du chargement: {error}
        </p>
        <Button onClick={onRetry} variant="outline" size="sm">
          Réessayer
        </Button>
      </div>
    </div>
  );
}

// Composant pour la section média (gauche)
export function MediaSection({ post }: { post: PostWithDetails }) {
  return (
    <div className="flex-1 bg-black flex items-center justify-center">
      {post.image ? (
        <div className="w-full h-full flex items-center justify-center">
          {post.image.includes(".mp4") ? (
            <video
              src={post.image}
              controls
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <img
              src={post.image}
              alt="Post content"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Aucun média</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour le header du post (simplifié pour la sidebar)
export function PostHeader({ post }: { post: PostWithDetails }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays}j`;
  };

  return (
    <div className="flex-shrink-0 bg-[var(--bgLevel2)] border-b border-[var(--detailMinimal)]">
      <div className="p-4 space-y-3">
        {/* Info utilisateur */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.user.avatar || "/placeholder.svg"}
              alt={post.user.username}
              className="object-cover"
            />
            <AvatarFallback>
              {post.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold text-sm text-foreground">
              {post.user.username}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(post.datetime)}
            </div>
          </div>
        </div>

        {/* Description du post */}
        {post.message && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground mr-2">
              {post.user.username}
            </span>
            {post.message}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour la section des commentaires
export function CommentsSection({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          Aucun commentaire pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isLast={index === comments.length - 1}
        />
      ))}
    </div>
  );
}

// Fonction utilitaire pour détecter si une URL est une image/GIF
function isImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
  const gifProviders = /giphy\.com|tenor\.com|imgur\.com/i;

  return imageExtensions.test(url) || gifProviders.test(url);
}

// Fonction pour convertir une URL Giphy en URL d'image directe
function getGiphyImageUrl(url: string): string {
  // Extraire l'ID du GIF depuis l'URL Giphy
  const giphyMatch = url.match(/giphy\.com\/gifs\/.*?([a-zA-Z0-9]+)$/);
  if (giphyMatch && giphyMatch[1]) {
    const gifId = giphyMatch[1];
    // Retourner l'URL directe vers le GIF
    return `https://media.giphy.com/media/${gifId}/giphy.gif`;
  }

  // Si ce n'est pas un format reconnu, retourner l'URL originale
  return url;
}

// Fonction pour convertir une URL Tenor en URL d'image directe
function getTenorImageUrl(url: string): string {
  // Pour Tenor, on peut essayer d'extraire l'ID et construire l'URL de média
  const tenorMatch = url.match(/tenor\.com\/view\/.*?(\d+)$/);
  if (tenorMatch && tenorMatch[1]) {
    const gifId = tenorMatch[1];
    return `https://media.tenor.com/images/${gifId}/tenor.gif`;
  }

  return url;
}

// Fonction pour obtenir l'URL d'image directe selon le fournisseur
function getDirectImageUrl(url: string): string {
  if (url.includes("giphy.com/gifs/")) {
    return getGiphyImageUrl(url);
  } else if (url.includes("tenor.com")) {
    return getTenorImageUrl(url);
  }

  return url;
}

// Fonction pour parser le contenu du commentaire et séparer texte et images
function parseCommentContent(message: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(message)) !== null) {
    // Ajouter le texte avant l'URL
    if (match.index > lastIndex) {
      const textBefore = message.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({ type: "text", content: textBefore });
      }
    }

    // Vérifier si l'URL est une image
    const url = match[0];
    if (isImageUrl(url)) {
      // Convertir l'URL en URL d'image directe si nécessaire
      const directImageUrl = getDirectImageUrl(url);
      parts.push({
        type: "image",
        content: directImageUrl,
        originalUrl: url, // Garder l'URL originale pour le fallback
      });
    } else {
      parts.push({ type: "link", content: url });
    }

    lastIndex = match.index + match[0].length;
  }

  // Ajouter le texte restant
  if (lastIndex < message.length) {
    const textAfter = message.slice(lastIndex).trim();
    if (textAfter) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  // Si aucune URL n'a été trouvée, retourner tout comme texte
  if (parts.length === 0) {
    parts.push({ type: "text", content: message });
  }

  return parts;
}

interface CommentContent {
  comment: Comment;
  isLiked?: boolean;
  likesCount?: number;
}

// Composant pour un commentaire individuel avec support des médias
interface CommentItemProps {
  comment: Comment;
  isLiked?: boolean;
  likesCount?: number;
  isLast?: boolean; // Pour gérer le style du dernier commentaire
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [reactionCount, setReactionCount] = useState(
    comment._count?.reactions ?? 0
  );
  const { initializeReactionCount } = useReactionContext();

  useEffect(() => {
    if (comment.id && comment._count?.reactions !== undefined) {
      initializeReactionCount(comment.id, comment._count.reactions);
    }
  }, [comment.id]);

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}j`;
  };

  const contentParts = parseCommentContent(comment.message);

  return (
    <div className="flex gap-3 border-b pb-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage
          src={comment.user.avatar || "/placeholder.svg"}
          alt={comment.user.username}
          className="object-cover"
        />
        <AvatarFallback>
          {comment.user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <span className="font-semibold text-foreground text-sm">
            {comment.user.username}
          </span>
        </div>

        <div className="space-y-2">
          {contentParts.map((part, index) => {
            if (part.type === "text") {
              return (
                <span key={index} className="text-foreground text-sm">
                  {part.content}
                </span>
              );
            } else if (part.type === "image") {
              return (
                <div key={index} className="mt-2">
                  <img
                    src={part.content}
                    alt="Contenu du commentaire"
                    className="max-w-full max-h-48 rounded-md object-contain border border-[var(--detailMinimal)]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const linkElement = document.createElement("a");
                      linkElement.href =
                        (part as any).originalUrl || part.content;
                      linkElement.textContent =
                        (part as any).originalUrl || part.content;
                      linkElement.target = "_blank";
                      linkElement.rel = "noopener noreferrer";
                      linkElement.className =
                        "text-blue-500 hover:underline text-sm break-all";
                      target.parentNode?.insertBefore(linkElement, target);
                    }}
                  />
                </div>
              );
            } else if (part.type === "link") {
              return (
                <a
                  key={index}
                  href={part.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm break-all"
                >
                  {part.content}
                </a>
              );
            }
            return null;
          })}
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          {formatDate(comment.datetime)}
        </div>

        {/* Composant de réaction simple, comme avant */}
        <ReactionComponent
          content={{
            contentId: comment.id,
            reaction: comment.reactions?.[0]?.type || null,
            reactionCount: comment._count?.reactions ?? 0,
            type: "comment",
          }}
        />
      </div>
    </div>
  );
};

// Composant pour le footer avec actions
export function PostFooter({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: (newComment: Comment) => void;
}) {
  return (
    <div className="flex-shrink-0 bg-[var(--bgLevel2)] border-t border-[var(--detailMinimal)]">
      <div className="p-2 w-full">
        <InputComment postId={postId} onCommentAdded={onCommentAdded} />
      </div>
    </div>
  );
}

export { PostDetails };
