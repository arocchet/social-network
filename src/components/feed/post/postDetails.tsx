/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InputComment from "../../comments/InputComment";
import { Post } from "@/lib/types/types";

interface PostDetailsProps {
  postId: string;
  trigger?: React.ReactNode; // Pour permettre un trigger personnalisé
}

interface Comment {
  id: string;
  message: string;
  datetime: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface PostWithDetails extends Post {
  comments: Comment[];
  reactions: any[];
}

function PostDetails({ postId, trigger }: PostDetailsProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fonction pour récupérer les détails du post
  const fetchPostDetails = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/private/post/${postId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch post details");
      }

      const data = await response.json();
      setPost(data.post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen && postId) {
      fetchPostDetails();
    }
  }, [isOpen, postId]);

  // Gestion du scroll pour détecter la fin
  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);

    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-3xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-50">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogDescription asChild>
            <div className="flex flex-col h-[80vh] max-h-[83vh] w-full rounded-md overflow-hidden">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={fetchPostDetails} />
              ) : post ? (
                /* Section des commentaires avec layout flex */
                <div className="flex flex-col h-full bg-[var(--bgLevel1)]">
                  {/* Header sticky avec info du post */}
                  <PostHeader post={post} />

                  {/* Liste des commentaires scrollable */}
                  <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto"
                  >
                    <CommentsSection comments={post.comments} />
                  </div>

                  {/* Footer fixe */}
                  <PostFooter
                    postId={postId}
                    onCommentAdded={fetchPostDetails}
                  />
                </div>
              ) : null}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Composant de chargement
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Chargement du post...</p>
      </div>
    </div>
  );
}

// Composant d'erreur
function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full">
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

// Composant pour le header du post
function PostHeader({ post }: { post: PostWithDetails }) {
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
          <div className="font-semibold text-foreground">
            {post.user.username}
          </div>
        </div>

        {/* Description du post */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          {post.message}
          <div className="text-xs text-muted-foreground mt-1">
            {formatDate(post.datetime)}
          </div>
        </div>

        {/* Image/Vidéo du post si présente */}
        {post.image && (
          <div className="rounded-lg overflow-hidden">
            {post.image.includes(".mp4") ? (
              <video
                src={post.image}
                controls
                className="w-full max-h-64 object-cover"
              />
            ) : (
              <img
                src={post.image}
                alt="Post content"
                className="w-full max-h-64 object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour la section des commentaires
function CommentsSection({ comments }: { comments: Comment[] }) {
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
    <div className="space-y-4">
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

// Composant pour un commentaire individuel
function CommentItem({
  comment,
  isLast,
}: {
  comment: Comment;
  isLast?: boolean;
}) {
  const formatDate = (dateString: string) => {
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

  return (
    <div
      className={`flex flex-col gap-2 px-4 ${
        !isLast ? "border-b border-[var(--detailMinimal)] pb-4" : "pb-4"
      }`}
    >
      {/* Header du commentaire */}
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={comment.user.avatar || "/placeholder.svg"}
            alt={comment.user.username}
            className="object-cover"
          />
          <AvatarFallback>
            {comment.user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.user.username}</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(comment.datetime)}
          </span>
        </div>
      </div>

      {/* Contenu du commentaire */}
      <div className="ml-11 text-sm">{comment.message}</div>
    </div>
  );
}

// Composant pour le footer avec actions
function PostFooter({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: () => void;
}) {
  return (
    <div className="flex-shrink-0 bg-[var(--bgLevel2)] border-t border-[var(--detailMinimal)] -mt-px">
      <div className="p-2 w-full">
        <InputComment />
      </div>
    </div>
  );
}

export { PostDetails };
