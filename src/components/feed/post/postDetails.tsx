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
import { useEffect, useRef, useState } from "react";
import { User } from "./postCard";
import { createRandomUser } from "./fakeUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InputComment from "../../comments/InputComment";
import PostReaction from "./postReaction";
import CommentPage from "@/components/comments/Comment";

function PostDetails() {
    const [hasReadToBottom, setHasReadToBottom] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: 50 }, () => createRandomUser());
        setUsers(generated);
    }, []);

    const handleScroll = () => {
        const content = contentRef.current;
        if (!content) return;

        const scrollPercentage = content.scrollTop / (content.scrollHeight - content.clientHeight);
        if (scrollPercentage >= 0.99 && !hasReadToBottom) {
            setHasReadToBottom(true);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* Add comments.length number of comments for this post */}
                <Button className="p-0" variant="ghost">Afficher les commentaires</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-5xl [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogDescription asChild>
                        <div className="flex flex-col sm:flex-row h-[80vh] max-h-[80vh] w-full">
                            {/* Image - en haut sur mobile, à gauche sur desktop */}
                            <div className="w-full sm:w-1/2 shrink-0">
                                <video
                                    autoPlay
                                    loop
                                    className="h-64 sm:h-full w-full object-cover sm:rounded-tl-lg"
                                    src={"https://videos.pexels.com/video-files/3198512/3198512-sd_640_360_25fps.mp4"}

                                />
                            </div>

                            {/* Partie commentaires scrollable */}
                            {/* Partie commentaires scrollable */}
                            <div
                                ref={contentRef}
                                onScroll={handleScroll}
                                className="relative flex flex-col w-full sm:w-1/2 overflow-y-auto"
                            >
                                {/* Header sticky */}
                                <div className="p-4 border-b border-[var(--detailMinimal)] sticky top-0 bg-background z-10 rounded-tr-xl">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={""} alt={""} className="object-cover" />
                                            <AvatarFallback />
                                        </Avatar>
                                        <div className="font-medium">UserName</div>
                                    </div>
                                </div>

                                {/* Liste des commentaires + padding bas */}
                                <div className="p-4 space-y-4  [&_strong]:font-semibold [&_strong]:text-foreground">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={""} alt={""} className="object-cover" />
                                            <AvatarFallback />
                                        </Avatar>
                                        <div className="font-medium">Bonjour à tous ceci est la description du post</div>
                                    </div>
                                    {users.map((user, index) => (
                                        <div key={index}>
                                            <div className="flex-col">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={user.avatar} alt={""} className="object-cover" />
                                                        <AvatarFallback />
                                                    </Avatar>
                                                    {user.username}

                                                </div>
                                                <CommentPage />
                                                <div className="px-4 pb-5">
                                                    <PostReaction />

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="sticky bottom-0 bg-background z-10 border-t border-border px-8 py-3 ">

                                    <PostReaction />
                                    <div className="text-sm text-[var(--greyFill)] pt-3">il y a 12 heures</div>
                                    <div className="h-5 "></div>
                                    <InputComment />
                                </div>
                            </div>

                        </div>
                    </DialogDescription>

                </DialogHeader>

            </DialogContent>
        </Dialog>
    );
}

export { PostDetails };
