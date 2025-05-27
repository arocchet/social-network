/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { createRandomUser } from "./fakeUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
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
            className="rounded-xl shadow-none w-full h-96 bg-[var(--bgLevel2)] border-[var(--detailMinimal)] "
          >
            <CardHeader className="flex">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="object-cover"
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-col">
                <div className="text-lg font-semibold">{user.username}</div>
                <div className="text-sm text-[var(--textNeutral)]">{user.email}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-xs text-[var(--textMinimal)] mt-1">
                  Registered: {new Date(user.registeredAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default PostCard;
