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
import { MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { User } from "./postCard";
import { createRandomUser } from "./fakeUser";
import InputComment from "../../comments/InputComment";
import PostReaction from "./postReaction";
import CommentPage from "@/components/comments/Comment";

interface PostDetailsProps {
  postId?: string;
  username?: string;
  userAvatar?: string;
  description?: string;
  commentsCount?: number;
}

function PostDetails({
  username = "UserName",
  userAvatar = "",
  description = "Bonjour à tous ceci est la description du post",
  commentsCount = 0,
}: PostDetailsProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Génération des utilisateurs factices
  useEffect(() => {
    const generated = Array.from({ length: 50 }, () => createRandomUser());
    setUsers(generated);
  }, []);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0 relative">
          <MessageCircle className="w-6 h-6" />
          {commentsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {commentsCount > 99 ? "99+" : commentsCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-3xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-50">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogDescription asChild>
            <div className="flex flex-col sm:flex-row h-[80vh] max-h-[83vh] w-full rounded-md overflow-hidden">
              {/* Section des commentaires */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="relative flex flex-col w-full overflow-y-auto bg-[var(--bgLevel1)] "
              >
                {/* Header sticky avec info du post */}
                <PostHeader
                  username={username}
                  userAvatar={userAvatar}
                  description={description}
                />

                {/* Liste des commentaires */}
                <CommentsSection users={users} />

                {/* Footer sticky avec actions */}
                <PostFooter />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour le header du post
function PostHeader({
  username,
  userAvatar,
  description,
}: {
  username: string;
  userAvatar: string;
  description: string;
}) {
  return (
    <div className="sticky top-0 z-10 bg-[var(--bgLevel2)] border-b border-[var(--detailMinimal)]">
      <div className="p-4 space-y-3">
        {/* Info utilisateur */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={userAvatar || "/placeholder.svg"}
              alt={username}
              className="object-cover"
            />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-semibold text-foreground">{username}</div>

        </div>

        {/* Description du post */}
        {description && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {description}
            <div className="text-xs text-muted-foreground">il y a 12 heures</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour la section des commentaires
function CommentsSection({ users }: { users: User[] }) {
  return (
    <div className="flex-1 space-y-4">
      {users.map((user, index) => (
        <CommentItem key={`${user.userId}-${index}`} user={user} />
      ))}
    </div>
  );
}

// Composant pour un commentaire individuel
function CommentItem({ user }: { user: User }) {
  return (
    <div className="border-b border-[var(--detailMinimal)] pb-6 flex flex-col gap-0">
      {/* Header du commentaire */}
      <div className="flex items-center gap-3 px-4">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.username}
            className="object-cover"
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{user.username}</span>

      </div>

      {/* Contenu du commentaire */}
      <div className="self-center">
        <CommentPage />
      </div>

      {/* Réactions du commentaire */}
      {/* <div className="ml-11">
        <PostReaction />
      </div> */}
    </div>
  );
}

// Composant pour le footer avec actions
function PostFooter() {
  return (
    <div className="sticky -bottom-0.5 z-10 bg-[var(--bgLevel2)] border-t border-[var(--detailMinimal)] flex">
        <div className="p-2 w-full">
          <InputComment />
        </div>
    </div>
  );
}

export { PostDetails };
