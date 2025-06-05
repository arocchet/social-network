"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { GifPopover } from "@/app/utils/giphy";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/reaction/emojiPicker";

type MediaFile = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

const CreatePost: React.FC = () => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestion sélection GIF (affiche en dessous du textarea)
  const handleGifSelect = (gif: any) => {
    const gifUrl = gif.images.fixed_width.url || gif.images.original.url;
    setSelectedGif(gifUrl);
    // On peut aussi ajouter une "balise" dans le contenu, ou juste garder le GIF à part
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
    setIsEmojiOpen(false);
  };

  // Ajout des fichiers (images/videos)
  const addFiles = (files: FileList) => {
    const newFiles: MediaFile[] = [];
    Array.from(files).forEach((file) => {
      // Limite taille 20 Mo
      if (file.size > 20 * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max 20 Mo)`);
        return;
      }
      // Accepter images et vidéos uniquement
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert(
          `Le fichier ${file.name} n'est pas une image ou une vidéo valide.`
        );
        return;
      }
      const type = file.type.startsWith("image/") ? "image" : "video";
      const previewUrl = URL.createObjectURL(file);
      newFiles.push({ file, previewUrl, type });
    });
    if (newFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Suppression d’un média
  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newArr = [...prev];
      // Libérer l'URL mémoire
      URL.revokeObjectURL(newArr[index].previewUrl);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // Ouverture du sélecteur de fichiers
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
        >
          <PlusSquare className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 w-full sm:max-h-[min(840px,90vh)] sm:max-w-3xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-[60]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[var(--bgLevel1)] rounded-xl">
            <DialogTitle className="text-lg font-semibold">
              Créer un post
            </DialogTitle>
            <DialogClose asChild></DialogClose>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[var(--bgLevel1)]">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div>
                <p className="font-medium text-sm">Utilisateur</p>
                <p className="text-xs text-[var(--textNeutral)]">Public</p>
              </div>
            </div>

            {/* Text input */}
            <div className="space-y-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Que voulez-vous partager ?"
                className="w-full min-h-[120px] p-3 text-base resize-none border-1 border-[var(--detailMinimal)] rounded-lg outline-none bg-[var(--bgLevel2)] placeholder:text-[var(--textNeutral)]"
                style={{ fontSize: "16px" }}
              />

              {/* Affichage du GIF sélectionné */}
              {selectedGif && (
                <div className="relative">
                  <img
                    src={selectedGif}
                    alt="GIF sélectionné"
                    className="max-w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedGif(null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-70"
                    aria-label="Supprimer le GIF"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Aperçu des fichiers médias */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {mediaFiles.map((media, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden border border-[var(--detailMinimal)]"
                    >
                      {media.type === "image" ? (
                        <img
                          src={media.previewUrl}
                          alt={`Media preview ${i}`}
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <video
                          src={media.previewUrl}
                          controls
                          className="w-full h-auto"
                        />
                      )}
                      <button
                        onClick={() => removeMedia(i)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-70"
                        aria-label="Supprimer le média"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Media upload area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={openFileDialog}
              className="border-2 border-dashed border-[var(--detailMinimal)] bg-[var(--bgLevel2)] rounded-lg p-8 text-center hover:border-[var(--detailNeutralAlt)] transition-colors cursor-pointer select-none"
              aria-label="Zone de dépôt ou sélection de photos et vidéos"
            >
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) addFiles(e.target.files);
                }}
              />
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-[var(--bgLevel1)] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[var(--textNeutral)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Ajouter des photos/vidéos</p>
                <p className="text-xs text-[var(--textNeutral)]">
                  ou glissez-déposez
                </p>
              </div>
            </div>

            {/* Emoji and GIF buttons */}
            <div className="flex items-center gap-2">
              <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="border-1 border-[var(--detailMinimal)] p-2 flex items-center justify-center"
                  >
                    <FaRegFaceSmileBeam className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0 z-[100]">
                  <EmojiPicker
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => {
                      handleEmojiSelect(emoji);
                    }}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>

              <GifPopover apiKey="" onSelect={handleGifSelect} />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-[var(--bgLevel1)] rounded-xl">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              // à compléter : gérer l’envoi du post complet (texte + media + gif)
            >
              Publier
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
