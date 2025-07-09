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
  Video,
  Settings,
  Share,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-theme";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import { useUserProfile } from "@/hooks/use-user-data";
import { formatDate } from "@/app/utils/dateFormat";
import { useUserPosts } from "@/hooks/use-posts-by-user";
import { useState, useMemo, useRef, useEffect } from "react";
import { PostProvider } from "@/app/context/post-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { LoadingState, ErrorState, MediaSection, CommentsSection, PostHeader, PostFooter } from "@/components/feed/post/postDetails";
import { useParams, useRouter } from "next/navigation";
import { set } from "date-fns";

type FilterType = 'all' | 'photos' | 'videos' | 'text';

export default function ProfilePage() {

  const params = useParams();

  const userId = params?.userId as string | undefined

  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedPostDetails, setSelectedPostDetails] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [postDetailsLoading, setPostDetailsLoading] = useState(false);
  const [postDetailsError, setPostDetailsError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    user: profileUser,
    loading,
    error,
    isOwnProfile,
    refetch
  } = useUserProfile(userId)


  const { posts, hasMore, loadMore } = useUserPosts({
    userId: profileUser?.id,
    limit: 12
  });
  // Initialiser les états de suivi

  useEffect(() => {
    if (!profileUser) return;

    // Vérifier si l'utilisateur actuel suit le profil
    const checkFollowingStatus = async () => {
      try {
        const response = await fetch(`/api/private/follow/${profileUser.id}/`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setIsFollowing(false);
          return;
        } else {
          setIsFollowing(true);
          return;
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du suivi:", err);
      }
    };

    checkFollowingStatus();
  }, [profileUser]);


  // Fonction pour suivre/ne plus suivre un utilisateur
  const handleFollowToggle = async () => {
    if (!profileUser?.id || isOwnProfile) return;

    try {
      ;
      const response = await fetch(`/api/private/follow/${profileUser?.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: profileUser.id }),
      });

      const data = await response.json();

      if (!data.success) {
        console.log(response)
      }

      console.log("Réponse de l'API de suivi:", data);

      if (data.data) {
        setIsFollowing(true)
      } else {
        setIsFollowing(false);
      }


      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
    } catch (err) {
      console.error("Erreur lors du suivi:", err);
    }
  };

  const fetchPostDetails = async (targetPostId: string) => {
    if (!targetPostId) return;

    try {
      setPostDetailsLoading(true);
      setPostDetailsError(null);

      const response = await fetch(`/api/private/post/${targetPostId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch post details");
      }

      const data = await response.json();
      setSelectedPostDetails(data.post);
    } catch (err) {
      setPostDetailsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setPostDetailsLoading(false);
    }
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setSelectedPostDetails(post);
    setIsOpen(true);
    fetchPostDetails(post.id);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedPost(null);
    setSelectedPostDetails(null);
    setPostDetailsError(null);
  };

  const getMediaType = (mediaUrl: string | null) => {
    if (!mediaUrl) return 'text';

    if (mediaUrl.includes('/video/') || mediaUrl.includes('video')) return 'video';
    if (mediaUrl.includes('/image/') || mediaUrl.includes('image')) return 'image';

    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    const lowerUrl = mediaUrl.toLowerCase();

    if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video';
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image';

    return 'image';
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    switch (activeFilter) {
      case 'photos':
        return posts.filter(post => getMediaType(post.image) === 'image');
      case 'videos':
        return posts.filter(post => getMediaType(post.image) === 'video');
      case 'text':
        return posts.filter(post => !post.image);
      default:
        return posts;
    }
  }, [posts, activeFilter]);

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

  // Afficher un loader pendant le chargement initial
  if (loading) {
    return (
      <div className="flex h-screen bg-[var(--bgLevel1)] items-center justify-center">
        <div className="text-[var(--textMinimal)]">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[var(--bgLevel1)] items-center justify-center">
        <div className="p-4 text-center">
          <div className="text-red-600 mb-4">
            Erreur lors du chargement du profil: {error}
          </div>
          <Button onClick={refetch} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex h-screen bg-[var(--bgLevel1)] items-center justify-center">
        <div className="text-[var(--textMinimal)]">Profil non trouvé</div>
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

  const PostItem = ({ post }: { post: any }) => {
    const mediaType = getMediaType(post.image);

    return (
      <div
        className="aspect-square relative group cursor-pointer bg-[var(--bgLevel1)] rounded-lg overflow-hidden"
        onClick={() => handlePostClick(post)}
      >
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
          <div className="flex items-center justify-center p-2 h-full text-xs text-[var(--textNeutral)] text-center break-words">
            <p className="line-clamp-4">{post.content}</p>
          </div>
        )}

        {mediaType === 'video' && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            <Video className="w-3 h-3" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">
                {post._count?.reactions || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="text-sm font-semibold">
                {post._count?.comments || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PostProvider>
      <div className="flex h-screen bg-[var(--bgLevel1)]">
        <NavigationBar />

        <div className="flex-1 flex flex-col overflow-auto">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] bg-[var(--bgLevel1)] sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="font-semibold text-lg text-[var(--textNeutral)]">
                {profileUser.username}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
              <ModeToggle />
            </div>
          </header>

          {/* Contenu principal */}
          <div className="bg-[var(--bgLevel1)] mx-auto w-full">
            {/* Profile Info avec Bannière */}
            <div className="bg-[var(--bgLevel2)]">
              {/* Bannière */}
              <div className="relative h-32 md:h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
                {profileUser.banner ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={profileUser.banner}
                      alt="Bannière de profil"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
                )}

                {isOwnProfile && (
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
                        src={profileUser.avatar || "/placeholder.svg"}
                        alt={profileUser.username}
                      />
                      <AvatarFallback className="bg-[var(--greyFill)] text-[var(--textNeutral)]">
                        {profileUser.username![0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {isOwnProfile && (
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
                          {posts?.length || 0}
                        </div>
                        <div className="text-sm text-[var(--textMinimal)]">
                          {(posts?.length || 0) > 1 ? 'publications' : 'publication'}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="font-semibold text-lg text-[var(--textNeutral)]">
                          {followersCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-[var(--textMinimal)]">
                          abonnés
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="font-semibold text-lg text-[var(--textNeutral)]">
                          {/* {profileUser.followingCount || 0} */}
                          0
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
                  {profileUser.birthDate && (
                    <h2 className="font-semibold text-base mb-1 text-[var(--textNeutral)]">
                      {formatDate(profileUser.birthDate)}
                    </h2>
                  )}
                  {(profileUser.firstName || profileUser.lastName) && (
                    <h2 className="font-semibold text-base mb-1 text-[var(--textNeutral)]">
                      {profileUser.firstName} {profileUser.lastName}
                    </h2>
                  )}
                  <p className="text-sm text-[var(--textMinimal)] mb-1">
                    @{profileUser.username}
                  </p>
                  <div className="text-sm whitespace-pre-line text-[var(--textMinimal)] mb-2">
                    {profileUser.biography || (isOwnProfile ? "Aucune bio pour le moment" : "Aucune biographie")}
                  </div>
                  {/* {profileUser.website && (
                    <a
                      href={`https://${profileUser.website}`}
                      className="text-sm text-[var(--blue)] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profileUser.website}
                    </a>
                  )} */}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 mx-2 border-[var(--detailMinimal)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                      >
                        Modifier le profil
                      </Button>
                      <Button className="flex-1 mx-2 bg-[var(--pink20)] hover:bg-[var(--pink40)] text-white">
                        <Share className="w-4 h-4 mr-2" />
                        Partager le profil
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleFollowToggle}
                        className={`flex-1 ${isFollowing
                          ? "bg-[var(--greyFill)] text-[var(--textNeutral)] hover:bg-[var(--greyHighlighted)]"
                          : "bg-[var(--blue)] hover:bg-[var(--blue)] text-white"
                          }`}
                      >
                        {isFollowing ? "Suivi(e)" : "Suivre"}
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
                {!posts ? (
                  <div className="flex justify-center py-8">
                    <div className="text-[var(--textMinimal)]">Chargement des posts...</div>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--textMinimal)]">
                      {activeFilter === 'photos' && 'Aucune photo à afficher'}
                      {activeFilter === 'videos' && 'Aucune vidéo à afficher'}
                      {activeFilter === 'text' && 'Aucun post texte à afficher'}
                      {activeFilter === 'all' && (isOwnProfile ? 'Vous n\'avez pas encore publié de contenu' : 'Aucun post à afficher')}
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

        {/* Dialog pour afficher les détails du post */}
        <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(840px,90vh)] sm:max-w-5xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-50">
            <DialogHeader className="contents space-y-0 text-left">
              <DialogDescription asChild>
                <div className="flex h-[80vh] max-h-[83vh] w-full rounded-md overflow-hidden">
                  {postDetailsLoading ? (
                    <LoadingState />
                  ) : postDetailsError ? (
                    <ErrorState error={postDetailsError} onRetry={() => selectedPost && fetchPostDetails(selectedPost.id)} />
                  ) : selectedPostDetails ? (
                    <div className="flex w-full h-full">
                      <MediaSection post={selectedPostDetails} />
                      <div className="flex flex-col w-[500px] bg-[var(--bgLevel1)] border-l border-[var(--detailMinimal)]">
                        <PostHeader post={selectedPostDetails} />
                        <div
                          ref={contentRef}
                          className="flex-1 overflow-y-auto"
                        >
                          <CommentsSection comments={selectedPostDetails.comments || []} />
                        </div>
                        <PostFooter
                          postId={selectedPostDetails.id}
                          onCommentAdded={() => fetchPostDetails(selectedPostDetails.id)}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </PostProvider>
  );
}