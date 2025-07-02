"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { createStoryClient } from "@/lib/client/stories/createStory";
import { CreateStory as CreateStoryType } from "@/lib/schemas/stories/";
import { StorySchemas } from "@/lib/schemas/stories";

type MediaFile = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

interface CreateStoryProps {
  onStoryCreated?: () => void;
}

const CreateStory: React.FC<CreateStoryProps> = ({ onStoryCreated }) => {
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ajout d'un fichier (image/vidéo uniquement)
  const addFile = (file: File) => {
    // Limite taille 50 Mo pour les stories
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", {
        description: "La taille maximale est de 50 Mo pour les stories.",
      });
      return;
    }

    // Accepter images et vidéos uniquement
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Format non supporté", {
        description: "Seules les images et vidéos sont acceptées.",
      });
      return;
    }

    const type = file.type.startsWith("image/") ? "image" : "video";
    const previewUrl = URL.createObjectURL(file);

    // Libérer l'ancienne URL si elle existe
    if (mediaFile) {
      URL.revokeObjectURL(mediaFile.previewUrl);
    }

    setMediaFile({ file, previewUrl, type });
  };

  // Gestion des fichiers depuis l'input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFile(e.target.files[0]);
    }
  };

  // Drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Suppression du média
  const removeMedia = () => {
    if (mediaFile) {
      URL.revokeObjectURL(mediaFile.previewUrl);
      setMediaFile(null);
    }
  };

  // Ouverture du sélecteur de fichiers
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Soumission de la story
  async function handleStorySubmit() {
    if (!mediaFile) {
      toast.error("Média requis", {
        description:
          "Vous devez ajouter une image ou une vidéo pour créer une story.",
      });
      return;
    }

    const data: CreateStoryType = {
      media: mediaFile.file,
    };

    const result = StorySchemas.Create.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
        .join("\n");

      toast.error("Erreur de validation", {
        description: errorMessages || "Le fichier n'est pas valide.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await createStoryClient(result.data);
      if (!response.success) {
        toast.error('Error please try again later')
        return
      }

      onStoryCreated?.();

      // Nettoyage
      removeMedia();
      setIsDialogOpen(false);

    } catch (error) {
      toast.error("Erreur de publication", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la publication de votre story.",
      });

      console.error("Erreur lors de la publication de la story :", error);
    } finally {
      setIsUploading(false);
    }
  }

  // Nettoyage lors de la fermeture
  const handleDialogClose = (open: boolean) => {
    if (!open && mediaFile) {
      URL.revokeObjectURL(mediaFile.previewUrl);
      setMediaFile(null);
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-600 transition-colors">
          <Plus className="w-3 h-3 text-white" />
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 w-full sm:max-h-[min(840px,90vh)] sm:max-w-2xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-[60] bg-[var(--bgLevel1)] rounded-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[var(--bgLevel1)] rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div>
                <p className="font-medium text-sm">Créer une story</p>
                <p className="text-xs text-[var(--textNeutral)]">
                  Visible 24h • Public
                </p>
              </div>
            </div>
            <DialogClose asChild />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[var(--bgLevel1)] p-4">
            {mediaFile ? (
              <div className="max-w-[400px] mx-auto">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  {mediaFile.type === "image" ? (
                    <img
                      src={mediaFile.previewUrl}
                      alt="Story preview"
                      className="w-full max-h-[500px] object-contain"
                    />
                  ) : (
                    <video
                      src={mediaFile.previewUrl}
                      controls
                      className="w-full max-h-[500px] object-contain"
                    />
                  )}
                  <button
                    onClick={removeMedia}
                    className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={openFileDialog}
                className="border-2 border-dashed border-[var(--detailMinimal)] bg-[var(--bgLevel2)] rounded-lg p-12 text-center hover:border-[var(--detailNeutralAlt)] transition-colors cursor-pointer select-none"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-[var(--bgLevel1)] rounded-full flex items-center justify-center">
                    <ImagePlus className="w-10 h-10 text-[var(--textNeutral)]" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Ajouter une photo ou vidéo
                    </p>
                    <p className="text-sm text-[var(--textNeutral)]">
                      Glissez-déposez ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-[var(--textNeutral)] mt-2">
                      Taille max : 50 Mo
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-[var(--bgLevel1)] rounded-b-xl">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-[var(--detailMinimal)] hover:bg-[var(--bgLevel2)]"
                disabled={isUploading}
              >
                Annuler
              </Button>
              <button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!mediaFile || isUploading}
                onClick={handleStorySubmit}
              >
                {isUploading ? "Publication..." : "Publier la story"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStory;
