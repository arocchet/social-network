"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Heart, Send } from "lucide-react";

interface StoryContent {
  id: number;
  image: string;
  timeAgo: string;
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

// Fonction pour extraire la couleur dominante d'une image
const extractDominantColor = (
  imageElement: HTMLImageElement
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve("#000000");
      return;
    }

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    ctx.drawImage(imageElement, 0, 0);

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
  const [message, setMessage] = useState("");
  const [dominantColor, setDominantColor] = useState<string>("#000000");
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentUser = users[currentUserIndex];
  const currentStoryContent = currentUser.stories[currentStoryIndex];
  const totalStoriesForUser = currentUser.stories.length;

  // Reset couleur et état de chargement quand l'image change
  useEffect(() => {
    setImageLoaded(false);
    setDominantColor("#000000");
  }, [currentStoryContent.image]);

  // Gestion du timer de progression automatique (optionnel)
  useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setTimeout(() => {
            onNext();
          }, 0);
          return 100;
        }
        return prev + 1; // Plus lent pour une meilleure UX
      });
    }, 50); // 5 secondes par story

    return () => clearInterval(timer);
  }, [currentStoryIndex, onNext]);

  const handleImageLoad = async () => {
    if (imageRef.current) {
      try {
        setTimeout(async () => {
          if (imageRef.current) {
            const color = await extractDominantColor(imageRef.current);
            setDominantColor(color);
            setImageLoaded(true);
          }
        }, 100);
      } catch (error) {
        console.error("Erreur lors de l'extraction de la couleur:", error);
        setDominantColor("#000000");
        setImageLoaded(true);
      }
    }
  };

  const handleImageError = () => {
    setDominantColor("#000000");
    setImageLoaded(true);
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 2) {
      onPrevious();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Arrière-plan avec couleur dominante */}
      {/* Arrière-plan noir par défaut */}
      <div className="absolute inset-0 bg-black" />

      {/* Arrière-plan avec couleur dominante par-dessus */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: dominantColor,
          opacity: imageLoaded ? 0.8 : 0,
        }}
      />

      {/* Gradient overlay pour améliorer la lisibilité */}
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
              <img
                ref={imageRef}
                src={currentStoryContent.image || "/placeholder.svg"}
                alt="Story"
                className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 rounded-lg"
                style={{
                  opacity: imageLoaded ? 1 : 0.7,
                  maxHeight: "calc(100vh - 200px)", // Laisser de l'espace pour header et footer
                  maxWidth: "calc(100vw - 32px)", // Laisser de l'espace pour le padding
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                crossOrigin="anonymous"
              />

              {/* Loading overlay */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Tap areas indicators (only visible on hover) */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-l-lg" />
            <div className="flex-1 hover:bg-white/5 transition-colors rounded-r-lg" />
          </div>
        </div>

        {/* Bottom input */}
        {/* <div className="p-4 flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="Répondre à cette story..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 pr-20 rounded-full"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div> */}

        {/* Debug info (à retirer en production) */}
        <div className="absolute bottom-20 left-4 text-white/50 text-xs bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          Couleur: {dominantColor}
        </div>
      </div>
    </div>
  );
}
