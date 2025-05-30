/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { createRandomUser } from "./fakeUser";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="space-y-4 ">
      {users.map((user, index) => (
        <div key={index}>
          <Card
            key={user.userId}
            className="rounded-xl shadow-none w-full  bg-[var(--bgLevel2)] border-[var(--detailMinimal)] "
          >
            <CardHeader className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-col">
                <div className="text-base font-semibold">{user.username}</div>
              </div>
              <div className="flex-col">
                {/* add var dateTime created post */}
                <div className="text-base text-[var(--greyFill)]">il y a </div>
              </div>
            </CardHeader>
            <CardContent className="h-full flex-col">
              <div >
                <img className="h-full" src={user.avatar}></img>
              </div>
            </CardContent>
            <CardFooter className="gap-2 flex-col items-start">
              <PostDetails />
              <InputComment />
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default PostCard;
