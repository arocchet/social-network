"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface StoryImageViewerProps {
  images: string[];
  currentIndex: number;
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
    const darkenedR = Math.max(0, r - 30);
    const darkenedG = Math.max(0, g - 30);
    const darkenedB = Math.max(0, b - 30);

    resolve(`rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`);
  });
};

export function StoryImageViewer({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: StoryImageViewerProps) {
  const [dominantColor, setDominantColor] = useState<string>("#000000");
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    setImageLoaded(false);
    setDominantColor("#000000");
  }, [currentImage]);

  const handleImageLoad = async () => {
    if (imageRef.current) {
      try {
        // Attendre un peu pour s'assurer que l'image est complètement chargée
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

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Arrière-plan avec couleur dominante */}
      <div
        className="absolute inset-0 transition-colors duration-500 ease-in-out"
        style={{
          backgroundColor: dominantColor,
          opacity: imageLoaded ? 0.8 : 0,
        }}
      />

      {/* Gradient overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

      {/* Header avec bouton fermer */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Indicateur de progression */}
      <div className="absolute top-16 left-4 right-4 z-10">
        <div className="flex gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  index === currentIndex
                    ? "w-full"
                    : index < currentIndex
                    ? "w-full"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image principale */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pt-24 pb-16">
        <div className="relative w-full h-full max-w-md">
          <img
            ref={imageRef}
            src={currentImage || "/placeholder.svg"}
            alt={`Story ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300"
            style={{ opacity: imageLoaded ? 1 : 0.7 }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            crossOrigin="anonymous"
          />

          {/* Loading overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="absolute inset-0 flex">
        {/* Zone cliquable gauche */}
        <button
          onClick={onPrevious}
          className="flex-1 flex items-center justify-start pl-4 text-white/0 hover:text-white/20 transition-colors"
          disabled={currentIndex === 0}
        >
          {currentIndex > 0 && (
            <ChevronLeft className="w-8 h-8 opacity-0 hover:opacity-100 transition-opacity" />
          )}
        </button>

        {/* Zone cliquable droite */}
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-end pr-4 text-white/0 hover:text-white/20 transition-colors"
        >
          <ChevronRight className="w-8 h-8 opacity-0 hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Info couleur (pour debug - à retirer en production) */}
      <div className="absolute bottom-4 left-4 text-white/70 text-xs bg-black/30 px-2 py-1 rounded">
        Couleur: {dominantColor}
      </div>
    </div>
  );
}
