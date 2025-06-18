"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Camera,
  Edit3,
  Grid3X3,
  FileText,
  Video,
  Play,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-theme";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import { useUser } from "@/hooks/use-user-data";
import { formatDate } from "@/app/utils/dateFormat";
import { useUserPosts } from "@/hooks/use-posts-by-user";
import { useState, useMemo } from "react";

const profileData = {
  username: "alice_photo",
  displayName: "Alice Martin",
  avatar: "/placeholder.svg?height=150&width=150",
  banner: "/placeholder.svg?height=200&width=600",
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

interface ProfilePageProps {
  onBack?: () => void;
  onSettingsClick?: () => void;
}

type FilterType = 'all' | 'photos' | 'videos' | 'text';

export default function ProfilePage({ }: ProfilePageProps) {
  const { user } = useUser();
  const userId = user?.id;
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { posts, loading, error, hasMore, loadMore } = useUserPosts({
    userId,
    limit: 12
  });

  // Fonction pour détecter le type de média
  const getMediaType = (mediaUrl: string | null) => {
    if (!mediaUrl) return 'text';

    // Si l'URL contient des indicateurs de type
    if (mediaUrl.includes('/video/') || mediaUrl.includes('video')) return 'video';
    if (mediaUrl.includes('/image/') || mediaUrl.includes('image')) return 'image';

    // Vérification par extension de fichier
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    const lowerUrl = mediaUrl.toLowerCase();

    if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video';
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image';

    // Par défaut, considérer comme image si il y a une URL media
    return 'image';
  };

  // Filtrer les posts selon le type sélectionné
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    switch (activeFilter) {
      case 'photos':
        return posts.filter(post => {
          const mediaType = getMediaType(post.image);
          return mediaType === 'image';
        });
      case 'videos':
        return posts.filter(post => {
          const mediaType = getMediaType(post.image);
          return mediaType === 'video';
        });
      case 'text':
        return posts.filter(post => !post.image);
      default:
        return posts;
    }
  }, [posts, activeFilter]);

  // Compter les posts par type
  const postCounts = useMemo(() => {
    if (!posts) return { all: 0, photos: 0, videos: 0, text: 0 };

    const photos = posts.filter(post => getMediaType(post.image) === 'image').length;
    const videos = posts.filter(post => getMediaType(post.image) === 'video').length;
    const textOnly = posts.filter(post => !post.image).length;

    return {
      all: posts.length,
      photos,
      videos,
      text: textOnly,
    };
  }, [posts]);


  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Erreur lors du chargement des posts: {error}
      </div>
    );
  }

  const TabButton = ({
    type,
    icon: Icon,
    label,
    count
  }: {
    type: FilterType;
    icon: any;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveFilter(type)}
      className={`flex-1 flex flex-col items-center py-3 px-2 border-b-2 transition-colors ${activeFilter === type
        ? 'border-[var(--blue)] text-[var(--blue)]'
        : 'border-transparent text-[var(--textMinimal)] hover:text-[var(--textNeutral)]'
        }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs font-medium">
        {label} ({count})
      </span>
    </button>
  );

  // Composant pour afficher un post individuel
  const PostItem = ({ post }: { post: any }) => {
    const mediaType = getMediaType(post.image);

    return (
      <div className="aspect-square relative group cursor-pointer bg-[var(--bgLevel1)] rounded-lg overflow-hidden">
        {mediaType === 'image' ? (
          <Image
            src={post.image || "https://i.pinimg.com/736x/ac/de/54/acde5463c760002ed97dc553eb8238ab.jpg"}
            alt="Post"
            fill
            className="object-cover border-[var(--detailMinimal)] border-1 rounded-lg"
          />
        ) : mediaType === 'video' ? (
          <video
            src={post.image}
            className="w-full h-full object-cover border-[var(--detailMinimal)] border-1 rounded-lg"
            muted
            loop
            onMouseEnter={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play();
            }}
            onMouseLeave={(e) => {
              const video = e.target as HTMLVideoElement;
              video.pause();
              video.currentTime = 0;
            }}
          />
        ) : (
          // Post texte uniquement
          <div className="flex items-center justify-center p-2 h-full text-xs text-[var(--textNeutral)] text-center break-words">
            <p className="line-clamp-4">{post.content}</p>
          </div>
        )}

        {/* Indicateur de type de média */}
        {mediaType === 'video' && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            <Video className="w-3 h-3" />
          </div>
        )}

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">
                {/* {post.reactions } */}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">
                {/* {post.comments} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--bgLevel1)]">
      <NavigationBar />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
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
              {user?.username}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>

        {/* Contenu principal */}
        <div className="bg-[var(--bgLevel1)] mx-auto w-full">
          {/* Profile Info avec Bannière */}
          <div className="bg-[var(--bgLevel2)]">
            {/* Bannière */}
            <div className="relative h-32 md:h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
              {user?.banner ? (
                <div className="relative w-full h-64">
                  <Image
                    src={user.banner}
                    alt="Bannière de profil"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
              )}

              {profileData.isOwnProfile && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Informations du profil */}
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4 -mt-12 relative">
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-[var(--bgLevel2)]">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg"}
                      alt={profileData.username}
                    />
                    <AvatarFallback className="bg-[var(--greyFill)] text-[var(--textNeutral)]">
                      {profileData.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {profileData.isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--bgLevel2)] border border-[var(--detailMinimal)] hover:bg-[var(--greyHighlighted)] rounded-full"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {/* Stats */}
                <div className="flex-1 mt-14">
                  <div className="flex justify-around text-center mb-4">
                    <div className="flex flex-col items-center">
                      <div className="font-semibold text-lg text-[var(--textNeutral)]">
                        {posts.length}
                      </div>
                      <div className="text-sm text-[var(--textMinimal)]">
                        {posts.length > 1 ? (
                          <>publications</>) : (
                          <>publication</>
                        )
                        }

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
              </div>

              {/* Name and Bio */}
              <div className="mb-4">
                <h2 className="font-semibold text-base mb-1 text-[var(--textNeutral)]">
                  {user?.birthDate && formatDate(user?.birthDate)}
                </h2>
                <h2 className="font-semibold text-base mb-1 text-[var(--textNeutral)]">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-[var(--textMinimal)] mb-1">
                  @{user?.username || profileData.username}
                </p>
                <div className="text-sm whitespace-pre-line text-[var(--textMinimal)] mb-2">
                  {user?.biography || "Aucune bio pour le moment"}
                </div>
                {user?.website && (
                  <a
                    href={`https://${user.website}`}
                    className="text-sm text-[var(--blue)] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {profileData.isOwnProfile ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 mx-2 border-[var(--detailMinimal)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                    >
                      Modifier le profil
                    </Button>
                    <Button className="flex-1 mx-2 bg-[var(--pink20)] hover:bg-[var(--pink40)] text-white">
                      Partager le profil
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className={`flex-1 ${profileData.isFollowing
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

          {/* TabBar pour filtrer les posts */}
          <div className="bg-[var(--bgLevel2)] border-t border-[var(--detailMinimal)] sticky top-[73px] z-40">
            <div className="flex">
              <TabButton
                type="all"
                icon={Grid3X3}
                label="Tous"
                count={postCounts.all}
              />
              <TabButton
                type="photos"
                icon={Camera}
                label="Photos"
                count={postCounts.photos}
              />
              <TabButton
                type="videos"
                icon={Video}
                label="Vidéos"
                count={postCounts.videos}
              />

            </div>
          </div>

          {/* Posts Grid */}
          <div className="bg-[var(--bgLevel2)]">
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="text-[var(--textMinimal)]">Chargement...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--textMinimal)]">
                    {activeFilter === 'photos' && 'Aucune photo à afficher'}
                    {activeFilter === 'videos' && 'Aucune vidéo à afficher'}
                    {activeFilter === 'all' && 'Aucun post à afficher'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {filteredPosts.map((post) => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}