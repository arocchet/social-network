/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { createRandomUser } from "./fakeUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { PostDetails } from "./postDetails";
import InputComment from "../../comments/InputComment";

export interface User {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  birthdate: Date;
  registeredAt: Date;
}

const PostCard = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }, () => createRandomUser());
    setUsers(generated);
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      {users.map((user, index) => (
        <div key={user.userId} className="self-center w-[95%] bg-[var(--bgLevel2)] border-1 rounded-2xl border-[var(--detailMinimal)] md:h-[95%]">
          {/* Header du post */}
          <div className="flex items-center justify-between p-3 border-b border-[var(--detailMinimal)]">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 ">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">{user.username}</span>
            </div>
            {/* <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button> */}
          </div>

          {/* Image du post */}
          <div className="relative aspect-square border-b border-[var(--detailMinimal)]">
            <img 
              src={user.avatar} 
              alt="Post" 
              className="min-w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="p-0">
                  <Heart className="w-6 h-6" />
                </Button>
                {/* <Button variant="ghost" size="icon" className="p-0">
                  <MessageCircle className="w-6 h-6" />
                </Button> */}
                <PostDetails />
                <Button variant="ghost" size="icon" className="p-0">
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="p-0">
                <Bookmark className="w-6 h-6" />
              </Button>
            </div>

            {/* Likes */}
            <div className="font-semibold text-sm mb-1">
              {Math.floor(Math.random() * 1000).toLocaleString()} mentions J'aime
            </div>

            {/* Caption */}
            <div className="text-sm">
              <span className="font-semibold mr-2">{user.username}</span>
              Une belle photo partagée !
            </div>

            {/* Time */}
            <div className="text-xs text-gray-500 mt-1 uppercase">
              Il y a {Math.floor(Math.random() * 24)}h
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostCard;