"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX, Heart } from "lucide-react";

interface StoryContent {
  id: number;
  image: string;
  timeAgo: string;
  mediaType?: 'image' | 'video'; // Nouveau champ pour différencier
}

interface Story {
  id: number;
  username: string;
  avatar: string;
  stories: StoryContent[];
}

interface StoryViewerProps {
  users: Story[];
  currentUserIndex: number;
  currentStoryIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Fonction pour détecter le type de média
const getMediaType = (url: string): 'image' | 'video' => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'm4v'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

  const extension = url.split('.').pop()?.toLowerCase();

  if (extension && videoExtensions.includes(extension)) {
    return 'video';
  }

  if (extension && imageExtensions.includes(extension)) {
    return 'image';
  }

  // Par défaut, essayer de détecter via l'URL ou le contenu
  if (url.includes('video') || url.includes('.mp4') || url.includes('.webm')) {
    return 'video';
  }

  return 'image'; // Par défaut
};

// Fonction pour extraire la couleur dominante d'une image
const extractDominantColor = (
  element: HTMLImageElement | HTMLVideoElement
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve("#000000");
      return;
    }

    // Gérer différemment selon le type d'élément
    let width: number, height: number;

    if (element instanceof HTMLVideoElement) {
      width = element.videoWidth || element.clientWidth;
      height = element.videoHeight || element.clientHeight;
    } else {
      width = element.naturalWidth;
      height = element.naturalHeight;
    }

    canvas.width = width;
    canvas.height = height;

    try {
      ctx.drawImage(element, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Échantillonner quelques pixels pour trouver la couleur dominante
      const colorMap: { [key: string]: number } = {};
      const step = 4 * 10; // Échantillonner tous les 10 pixels

      for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Ignorer les pixels transparents
        if (alpha < 128) continue;

        // Grouper les couleurs similaires
        const roundedR = Math.round(r / 10) * 10;
        const roundedG = Math.round(g / 10) * 10;
        const roundedB = Math.round(b / 10) * 10;

        const colorKey = `${roundedR},${roundedG},${roundedB}`;
        colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
      }

      // Trouver la couleur la plus fréquente
      let dominantColor = "0,0,0";
      let maxCount = 0;

      for (const [color, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      }

      const [r, g, b] = dominantColor.split(",").map(Number);

      // Assombrir légèrement la couleur pour un meilleur contraste
      const darkenedR = Math.max(0, r - 40);
      const darkenedG = Math.max(0, g - 40);
      const darkenedB = Math.max(0, b - 40);

      resolve(`rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`);
    } catch (error) {
      console.error("Erreur lors de l'extraction de couleur:", error);
      resolve("#000000");
    }
  });
};

export function StoryViewer({
  users,
  currentUserIndex,
  currentStoryIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [dominantColor, setDominantColor] = useState<string>("#000000");
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [, setIsPaused] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  // Vérifications de sécurité pour éviter les erreurs undefined
  const isValidUserIndex =
    currentUserIndex >= 0 && currentUserIndex < users.length;
  const currentUser = isValidUserIndex ? users[currentUserIndex] : null;
  const isValidStoryIndex =
    currentUser &&
    currentStoryIndex >= 0 &&
    currentStoryIndex < currentUser.stories.length;
  const currentStoryContent =
    isValidStoryIndex && currentUser
      ? currentUser.stories[currentStoryIndex]
      : null;

  // Déterminer le type de média
  const mediaType = currentStoryContent
    ? (currentStoryContent.mediaType || getMediaType(currentStoryContent.image))
    : 'image';

  // Fonction pour nettoyer le timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Fonction pour démarrer le timer
  const startTimer = useCallback((duration?: number) => {
    clearTimer(); // S'assurer qu'aucun timer n'est déjà en cours

    // Déterminer la durée selon le type de média
    let totalDuration: number;

    if (duration && mediaType === 'video') {
      // Utiliser la durée réelle de la vidéo
      totalDuration = duration * 1000; // Convertir en millisecondes
    } else {
      // Durée fixe pour les images (5 secondes)
      totalDuration = 5000;
    }

    // Calculer l'intervalle pour atteindre 100% dans la durée totale
    const interval = totalDuration / 100;

    timerRef.current = setInterval(() => {
      progressRef.current += 1; // Incrémenter la référence
      setProgress(progressRef.current);

      // Si on atteint 100%, passer à la suivante
      if (progressRef.current >= 100) {
        clearTimer();
        setTimeout(() => {
          onNext();
        }, 100);
      }
    }, interval);
  }, [clearTimer, onNext, mediaType]);

  // Si les indices sont invalides, fermer le viewer
  useEffect(() => {
    if (!isValidUserIndex || !isValidStoryIndex) {
      console.error("Indices invalides:", {
        currentUserIndex,
        usersLength: users.length,
        currentStoryIndex,
        storiesLength: currentUser?.stories.length,
      });
      setError("Données de story invalides");
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setError(null);
    }
  }, [
    currentUserIndex,
    currentStoryIndex,
    users,
    currentUser,
    isValidUserIndex,
    isValidStoryIndex,
    onClose,
  ]);

  // Reset complet lors du changement de média
  useEffect(() => {
    if (!currentStoryContent) return;

    // ARRÊTER IMMÉDIATEMENT le timer
    clearTimer();

    // Pause et reset de la vidéo précédente si elle existe
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Reset de tous les états
    setMediaLoaded(false);
    setDominantColor("#000000");
    setProgress(0);
    progressRef.current = 0;
    setIsPaused(true);
    setIsMuted(true); // Reset du mute aussi

    console.log("Reset pour nouvelle story:", currentStoryIndex, "Type:", mediaType);
  }, [currentUserIndex, currentStoryIndex, currentStoryContent, clearTimer, mediaType]);

  // Gestion du chargement de l'image
  const handleImageLoad = async () => {
    if (imageRef.current) {
      try {
        // Vérifier que c'est bien la bonne image (éviter les callbacks obsolètes)
        const currentImageSrc = imageRef.current.src;
        const expectedSrc = currentStoryContent?.image;

        if (!expectedSrc || !currentImageSrc.includes(expectedSrc.split('/').pop() || '')) {
          console.log("Callback image obsolète détecté, ignoré");
          return;
        }

        setTimeout(async () => {
          if (imageRef.current && imageRef.current.complete) {
            const color = await extractDominantColor(imageRef.current);
            setDominantColor(color);
            setMediaLoaded(true);

            setTimeout(() => {
              setIsPaused(false);
              startTimer(); // Pas de durée spécifique pour les images
            }, 200);
          }
        }, 200);
      } catch (error) {
        console.error("Erreur lors de l'extraction de la couleur:", error);
        setDominantColor("#000000");
        setMediaLoaded(true);
        setTimeout(() => {
          setIsPaused(false);
          startTimer();
        }, 200);
      }
    }
  };

  // Gestion du chargement de la vidéo
  const handleVideoLoad = async () => {
    if (videoRef.current) {
      try {
        // Vérifier que c'est bien la bonne vidéo (éviter les callbacks obsolètes)
        const currentVideoSrc = videoRef.current.src;
        const expectedSrc = currentStoryContent?.image;

        if (!expectedSrc || !currentVideoSrc.includes(expectedSrc.split('/').pop() || '')) {
          console.log("Callback obsolète détecté, ignoré");
          return;
        }

        // Attendre que la vidéo soit prête
        setTimeout(async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
            const color = await extractDominantColor(videoRef.current);
            setDominantColor(color);
            setMediaLoaded(true);

            // Obtenir la durée de la vidéo
            const videoDuration = videoRef.current.duration;
            console.log("Durée de la vidéo:", videoDuration, "secondes");

            // Pour les vidéos, utiliser leur durée réelle
            setTimeout(() => {
              setIsPaused(false);
              if (videoRef.current && !videoRef.current.paused) {
                // La vidéo pourrait déjà être en cours de lecture
              } else if (videoRef.current) {
                videoRef.current.play().catch(console.error);
              }
              // Passer la durée de la vidéo au timer
              startTimer(videoDuration);
            }, 200);
          }
        }, 300);
      } catch (error) {
        console.error("Erreur lors de l'extraction de la couleur vidéo:", error);
        setDominantColor("#000000");
        setMediaLoaded(true);
        setTimeout(() => {
          setIsPaused(false);
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
            // Utiliser une durée par défaut si on ne peut pas obtenir la vraie durée
            const fallbackDuration = videoRef.current.duration || 10; // 10 secondes par défaut
            startTimer(fallbackDuration);
          }
        }, 200);
      }
    }
  };

  // Gestion des erreurs de chargement
  const handleMediaError = () => {
    setDominantColor("#000000");
    setMediaLoaded(true);
    setTimeout(() => {
      setIsPaused(false);
      // Utiliser une durée par défaut en cas d'erreur
      startTimer(mediaType === 'video' ? 10 : undefined);
    });
  };

  // Gestion des clics pour navigation
  const handleTap = (e: React.MouseEvent) => {
    clearTimer();
    setIsPaused(true);

    // Pause/play vidéo si applicable
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 2) {
      onPrevious();
    } else {
      onNext();
    }
  };

  // Toggle mute pour les vidéos
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Nettoyer le timer au démontage du composant
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Si on a une erreur ou pas de contenu valide, afficher un message d'erreur
  if (error || !currentUser || !currentStoryContent) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <p className="mb-4">
              {error || "Impossible de charger cette story"}
            </p>
            <Button onClick={onClose} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Arrière-plan avec couleur dominante */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: dominantColor,
          opacity: mediaLoaded ? 0.8 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

      {/* Contenu par-dessus */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Progress bars */}
        <div className="flex gap-1 p-4">
          {currentUser.stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentStoryIndex
                      ? "100%"
                      : index === currentStoryIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.username}
              />
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold text-sm text-white">
                {currentUser.username}
              </span>
              <span className="text-xs text-white/70 ml-2">
                {currentStoryContent.timeAgo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Bouton mute/unmute pour les vidéos */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              <Heart />
            </Button>
            {mediaType === 'video' && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              // onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Story content */}
        <div className="flex-1 relative px-4 min-h-0" onClick={handleTap}>
          <div className="w-full h-full flex items-center justify-center min-h-0">
            <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">

              {mediaType === 'image' ? (
                <img
                  ref={imageRef}
                  key={`${currentUserIndex}-${currentStoryIndex}`} // Clé unique pour forcer le remount
                  src={currentStoryContent.image || "/placeholder.svg"}
                  alt="Story"
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 rounded-lg"
                  style={{
                    opacity: mediaLoaded ? 1 : 0.7,
                    maxHeight: "calc(100vh - 200px)",
                    maxWidth: "calc(100vw - 32px)",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleMediaError}
                  crossOrigin="anonymous"
                />
              ) : (
                <video
                  ref={videoRef}
                  key={`${currentUserIndex}-${currentStoryIndex}`} // Clé unique pour forcer le remount
                  src={currentStoryContent.image}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 rounded-lg"
                  style={{
                    opacity: mediaLoaded ? 1 : 0.7,
                    maxHeight: "calc(100vh - 200px)",
                    maxWidth: "calc(100vw - 32px)",
                  }}
                  onLoadedData={handleVideoLoad}
                  onError={handleMediaError}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  crossOrigin="anonymous"
                />
              )}

              {/* Loading overlay */}
              {!mediaLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Tap areas indicators */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-l-lg" />
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-r-lg" />
          </div>
        </div>

        {/* Debug info */}
        {/* <div className="absolute bottom-4 left-4 text-white/50 text-xs bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          Type: {mediaType} | {isPaused ? "⏸️ Pause" : "▶️ Lecture"} | Progress: {Math.round(progress)}%
          {mediaType === 'video' && videoRef.current && (
            <> | Durée: {Math.round(videoRef.current.duration || 0)}s</>
          )}
        </div> */}
      </div>
    </div>
  );
}