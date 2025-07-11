"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Post } from "@/lib/schemas/post";
import { PostDetails } from "../post/postDetails";

interface VideoReelCardProps {
    post: Post;
    isVisible: boolean;
}

export default function VideoReelCard({ post, isVisible }: VideoReelCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    console.log("Video play failed:", error);
                });
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    // Handle video play/pause state
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "À l'instant";
        if (diffInHours < 24) return `il y a ${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `il y a ${diffInDays}j`;
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[80vh] bg-black rounded-lg overflow-hidden">
            {/* Video */}
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    muted={isMuted}
                    autoPlay
                    playsInline
                    onClick={togglePlay}
                >
                    <source src={post.image!} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Play/Pause overlay */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-16 h-16 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30"
                            onClick={togglePlay}
                        >
                            <Play className="w-8 h-8 text-white" />
                        </Button>
                    </div>
                )}

                {/* Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                        onClick={toggleMute}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                        )}
                    </Button>
                </div>

                {/* User info and actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-end justify-between">
                        {/* User info and caption */}
                        <div className="flex-1 text-white mr-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage
                                        src={post.user.avatar || "/placeholder.svg"}
                                        alt={post.user.username}
                                    />
                                    <AvatarFallback>
                                        {post.user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{post.user.username}</p>
                                    <p className="text-xs text-gray-300">{formatDate(post.datetime)}</p>
                                </div>
                            </div>

                            {post.message && (
                                <p className="text-sm leading-relaxed line-clamp-3 mb-2">
                                    {post.message}
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                            >
                                <Heart className="w-6 h-6 text-white" />
                            </Button>
                            <div className="text-center">
                                <p className="text-xs text-white font-medium">
                                    {post._count.reactions}
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                                onClick={() => setShowDetails(true)}
                            >
                                <MessageCircle className="w-6 h-6 text-white" />
                            </Button>
                            <div className="text-center">
                                <p className="text-xs text-white font-medium">
                                    {post._count.comments}
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                            >
                                <Share className="w-6 h-6 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Details Modal */}
            {showDetails && (
                <PostDetails
                    postId={post.id}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}