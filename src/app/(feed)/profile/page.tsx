"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Grid3X3,
  Heart,
  MessageCircle,
  Home,
  Search,
  PlusSquare,
  SettingsIcon,
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
  isOwnProfile: true,
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
    <div className="flex flex-col bg-[var(--bgLevel1)] h-full w-full">
      {/* Header - même structure que la home page */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] bg-[var(--bgLevel1)] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-semibold text-lg text-[var(--textNeutral)]">
            {profileData.username}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      {/* Contenu principal centré - même structure que la home page */}
      <div className="bg-[var(--bgLevel1)] mx-auto max-w-xl px-2 py-2 w-full">
        {/* Profile Info */}
        <div className="bg-[var(--bgLevel2)] rounded-lg border border-[var(--detailMinimal)] mb-4">
          <div className="p-4">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border border-[var(--detailMinimal)]">
                <AvatarImage
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.username}
                />
                <AvatarFallback className="bg-[var(--greyFill)] text-[var(--textNeutral)]">
                  {profileData.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Stats */}
              <div className="flex-1">
                <div className="flex justify-around text-center mb-4">
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-lg text-[var(--textNeutral)]">
                      {profileData.stats.posts}
                    </div>
                    <div className="text-sm text-[var(--textMinimal)]">
                      publications
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-lg text-[var(--textNeutral)]">
                      {profileData.stats.followers.toLocaleString()}
                    </div>
                    <div className="text-sm text-[var(--textMinimal)]">
                      abonnés
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-lg text-[var(--textNeutral)]">
                      {profileData.stats.following}
                    </div>
                    <div className="text-sm text-[var(--textMinimal)]">
                      abonnements
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="mb-4">
              <h2 className="font-semibold text-sm mb-1 text-[var(--textNeutral)]">
                {profileData.displayName}
              </h2>
              <div className="text-sm whitespace-pre-line text-[var(--textMinimal)] mb-2">
                {profileData.bio}
              </div>
              {profileData.website && (
                <a
                  href={`https://${profileData.website}`}
                  className="text-sm text-[var(--blue)] hover:underline"
                >
                  {profileData.website}
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              {profileData.isOwnProfile ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 border-[var(--detailMinimal)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                  >
                    Modifier le profil
                  </Button>
                  <Button className="flex-1 bg-[var(--pink20)] hover:bg-[var(--pink40)] text-white">
                    Partager le profil
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={`flex-1 ${
                      profileData.isFollowing
                        ? "bg-[var(--greyFill)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                        : "bg-[var(--blue)] hover:bg-[var(--blue)] text-white"
                    }`}
                  >
                    {profileData.isFollowing ? "Suivi(e)" : "Suivre"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-[var(--detailMinimal)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Posts Grid avec Content Tabs intégrés */}
        <div className="bg-[var(--bgLevel2)] rounded-lg border border-[var(--detailMinimal)]">
          {/* Content Tabs */}
          <div className="flex border-b border-[var(--detailMinimal)]">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b border-[var(--detailMinimal)] text-[var(--textNeutral)]">
              <Grid3X3 className="w-4 h-4" />
              <span className="text-xs font-medium text-[var(--textNeutral)]">
                PUBLICATIONS
              </span>
            </button>
          </div>

          {/* Photos Grid */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square relative group cursor-pointer bg-[var(--bgLevel1)] rounded-lg overflow-hidden"
                >
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-white" />
                        <span className="text-sm font-semibold">
                          {post.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span className="text-sm font-semibold">
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - même structure que la home page */}
      <nav className="fixed bottom-4 left-1 right-1 z-40 max-w-3xl mx-auto">
        <div className="backdrop-blur-lg border border-[var(--detailMinimal)] bg-[var(--bgLevel1)] rounded-2xl max-w-xs sm:max-w-md md:max-w-lg mx-auto shadow-lg shadow-black/10 px-5 py-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
            >
              <Search className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition-colors duration-200 rounded-xl"
            >
              <PlusSquare className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition-colors duration-200 rounded-xl"
            >
              <SettingsIcon className="w-6 h-6" />
            </Button>
            <div className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-xl cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="/placeholder.svg?height=24&width=24"
                  alt="Profile"
                />
                <AvatarFallback className="bg-[var(--pink20)]"></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
