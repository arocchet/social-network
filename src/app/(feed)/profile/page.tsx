"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MoreHorizontal,
  Grid3X3,
  Play,
  TagIcon as UserTag,
  Settings,
  Share,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-theme";

const profileData = {
  username: "alice_photo",
  displayName: "Alice Martin",
  avatar: "/placeholder.svg?height=150&width=150",
  bio: "📸 Photographe passionnée\n🌍 Voyageuse dans l'âme\n✨ Capturer la beauté du quotidien\n📍 Paris, France",
  website: "localhost:3000",
  stats: {
    posts: 127,
    followers: 2847,
    following: 892,
  },
  isFollowing: false,
  isOwnProfile: true, // Changed to true to show settings button
};

const posts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    likes: 234,
    comments: 12,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    likes: 456,
    comments: 23,
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    likes: 789,
    comments: 34,
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    likes: 123,
    comments: 8,
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    likes: 567,
    comments: 19,
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    likes: 890,
    comments: 45,
  },
  {
    id: 7,
    image: "/placeholder.svg?height=300&width=300",
    likes: 345,
    comments: 16,
  },
  {
    id: 8,
    image: "/placeholder.svg?height=300&width=300",
    likes: 678,
    comments: 28,
  },
  {
    id: 9,
    image: "/placeholder.svg?height=300&width=300",
    likes: 912,
    comments: 52,
  },
];

interface ProfilePageProps {
  onBack?: () => void;
  onSettingsClick?: () => void;
}

export default function ProfilePage({
  onBack,
  onSettingsClick,
}: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-[var(--bgLevel1)]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-[var(--detailMinimal)] border-1 sticky top-0 bg-[var(--bgLevel2)] z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = "/"; //
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg text-[var(--textNeutral)]">
              {profileData.username}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {/* <Button variant="ghost" size="icon">
            <Share className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-6 h-6" />
          </Button> */}
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          {/* Avatar */}
          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-1 border-[var(--detailMinimal)]">
            <AvatarImage
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.username}
            />
            <AvatarFallback>
              {profileData.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Stats */}
          <div className="flex-1 self-center items-center mt-4">
            <div className="flex justify-around text-center mb-4">
              <div className="flex flex-col items-center">
                <div className="font-semibold items-center text-lg">
                  {profileData.stats.posts}
                </div>
                <div className="text-sm text-[var(--textNeutral)]">
                  publications
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold text-lg">
                  {profileData.stats.followers.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--textNeutral)]">abonnés</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-semibold text-lg">
                  {profileData.stats.following}
                </div>
                <div className="text-sm text-[var(--textNeutral)]">
                  abonnements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mb-4">
          <h2 className="font-semibold text-sm mb-1">
            {profileData.displayName}
          </h2>
          <div className="text-sm whitespace-pre-line text-[var(--textMinimal)] mb-2">
            {profileData.bio}
          </div>
          {profileData.website && (
            <a
              href={`https://${profileData.website}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {profileData.website}
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          {profileData.isOwnProfile ? (
            <>
              <Button variant="outline" className="flex-1">
                Modifier le profil
              </Button>
              <Button className="flex-1 bg-[var(--pink20)] hover:bg-[var(--pink20)] text-white">
                Partager le profil
              </Button>
              {/* <Button variant="outline" size="icon" onClick={onSettingsClick}>
                <Settings className="w-4 h-4" />
              </Button> */}
            </>
          ) : (
            <>
              <Button
                className={`flex-1 ${
                  profileData.isFollowing
                    ? "bg-gray-200 text-black hover:bg-gray-300"
                    : ""
                }`}
              >
                {profileData.isFollowing ? "Suivi(e)" : "Suivre"}
              </Button>
              <Button variant="outline" className="flex-1">
                Message
              </Button>
              <Button variant="outline" size="icon">
                <UserTag className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-t">
        {/* <div className="flex">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-black">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">PUBLICATIONS</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-transparent text-gray-400">
            <Play className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">REELS</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-transparent text-gray-400">
            <UserTag className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">IDENTIFIÉ(E)</span>
          </button>
        </div> */}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {posts.map((post) => (
          <div
            key={post.id}
            className="aspect-square relative group cursor-pointer"
          >
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[var(--bgLevel2)] /50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
