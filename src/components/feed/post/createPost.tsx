"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSquare, X, ImagePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/reaction/emojiPicker";

import { toast } from "sonner"
import { PostSchema } from "@/lib/validations/createPostSchemaZod";
import { createPostClient } from "@/lib/client/post/createPost";
import { CreatePostForm } from "@/lib/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostContext } from "@/app/context/post-context";
import { useUserContext } from "@/app/context/user-context";
import AppLoader from "@/components/ui/app-loader";


type MediaFile = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

const CreatePost: React.FC = () => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, loading } = useUserContext();
  const { setAllPosts, allposts } = usePostContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Suppression d'un média
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

  async function handlePostSubmit() {
    let media: CreatePostForm["media"] | undefined = undefined;
    if (mediaFiles.length > 0) {
      media = mediaFiles[0].file;
    }

    const data = {
      content: postContent,
      media: media,
    };

    console.log('type', media instanceof File);

    const result = PostSchema.safeParse(data);


    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
        .join("\n");

      toast.error("Erreur de validation", {
        description: errorMessages || "Des champs sont invalides.",
      });
      return;
    }


    try {
      const newPost = await createPostClient(result.data);

      const optimisticPost = {
        ...newPost,
        id: newPost.id ?? crypto.randomUUID(),
        content: postContent,
        media: mediaFiles[0]?.previewUrl ?? null,
        _count: { reactions: 0 },
        comments: [],
        user: {
          userId: user?.id || "inconnu",
          username: user?.username || "Anonyme",
          avatar: user?.avatar || null,
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        },
        datetime: new Date().toISOString(),
      };

      console.log("optimisticPost", optimisticPost)

      setAllPosts([optimisticPost, ...allposts]);
      setPostContent("");
      setMediaFiles([]);
      setIsDialogOpen(false);

      toast.success("Succès", {
        description: "Post publié avec succès !",
      });

    } catch (error) {
      toast.error("Erreur critique", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue lors de la publication.",
      });

      console.error("Erreur lors de la publication :", error);
    }
  }

  if (loading) return <AppLoader />

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="md:w-full md:h-auto md:justify-start flex items-center gap-3 p-3 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors text-normal"
        >
          <PlusSquare className="h-5 w-5" />
          <span className="hidden md:inline text-[var(--textNeutral)] font-normal">Créer un post</span>
        </button>
      </DialogTrigger>

      <DialogContent className="p-0 w-full sm:max-h-[min(840px,90vh)] sm:max-w-3xl [&>button:last-child]:top-3.5 [&>button:last-child]:z-[60] bg-[var(--bgLevel1)] rounded-xl">
        <div className="flex flex-col h-full">
          {/* Header with user info and title */}
          <div className="flex items-center justify-between p-4 border-b bg-[var(--bgLevel1)] rounded-t-xl">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 md:w-14 md:h-14 border-4 border-[var(--bgLevel2)]">
                <AvatarImage
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.username!}
                />
                <AvatarFallback className="bg-[var(--greyFill)] text-[var(--textNeutral)]">
                  {user?.username?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{user?.username}</p>
                <p className="text-xs text-[var(--textNeutral)]">Public</p>
              </div>
            </div>
            <DialogClose asChild></DialogClose>
          </div>

          {/* Content - Simplified structure */}
          <div className="flex-1 overflow-y-auto bg-[var(--bgLevel1)] p-4">
            {/* Media upload area */}
            {mediaFiles.length > 0 ? (
              <div className="mb-4">
                {/* Updated media container with consistent sizing */}
                <div className="max-w-[500px] mx-auto">
                  {mediaFiles.length === 1 ? (
                    <div className="relative rounded-md overflow-hidden">
                      {/* Single media - constrained height */}
                      {mediaFiles[0].type === "image" ? (
                        <img
                          src={mediaFiles[0].previewUrl}
                          alt="Media preview"
                          className="w-full object-contain max-h-[400px]"
                        />
                      ) : (
                        <video
                          src={mediaFiles[0].previewUrl}
                          controls
                          className="w-full object-contain max-h-[400px]"
                        />
                      )}
                      <button
                        onClick={() => removeMedia(0)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 aspect-square">
                      {/* Multiple media - grid layout */}
                      {mediaFiles.map((media, i) => (
                        <div
                          key={i}
                          className="relative aspect-square overflow-hidden"
                        >
                          {media.type === "image" ? (
                            <img
                              src={media.previewUrl}
                              alt={`Media preview ${i}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={media.previewUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                          <button
                            onClick={() => removeMedia(i)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={openFileDialog}
                className="border-2 border-dashed border-[var(--detailMinimal)] bg-[var(--bgLevel2)] rounded-lg p-8 text-center hover:border-[var(--detailNeutralAlt)] transition-colors cursor-pointer select-none mb-4"
              >
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-[var(--bgLevel1)] rounded-full flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-[var(--textNeutral)]" />
                  </div>
                  <p className="text-base font-medium">
                    Ajouter des photos/vidéos
                  </p>
                  <p className="text-sm text-[var(--textNeutral)]">
                    ou glissez-déposez
                  </p>
                </div>
              </div>
            )}

            {/* Text input area */}
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Que voulez-vous partager ?"
              className="w-full min-h-[120px] p-3 text-base resize-none border-1 border-[var(--detailMinimal)] rounded-lg outline-none bg-[var(--bgLevel2)] placeholder:text-[var(--textNeutral)]"
              style={{ fontSize: "16px" }}
            />

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
          </div>

          {/* Footer with emoji picker and publish button */}
          <div className="p-4 border-t bg-[var(--bgLevel1)] rounded-b-xl">
            <div className="flex items-center mb-4">
              <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="border-1 border-[var(--detailMinimal)] hover:bg-[var(--bgLevel2)] cursor-pointer p-2 flex items-center justify-center"
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
            </div>

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!postContent.trim() && mediaFiles.length === 0}
              onClick={handlePostSubmit}
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
