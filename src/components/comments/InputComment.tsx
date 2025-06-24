import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../reaction/emojiPicker";
import { GifPopover } from "@/app/utils/giphy";
import { CommentSchema } from "@/lib/validations/createCommentSchemaZod";
import { toast } from "sonner";
import { createCommentClient } from "@/lib/client/comment/createComment";
import { useUser } from "@/hooks/use-user-data";

interface InputCommentProps {
  postId: string;
  onCommentAdded?: () => void;
}

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;


const InputComment = ({ postId, onCommentAdded }: InputCommentProps) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  // Fonction pour soumettre le commentaire
  async function handleCommentSubmit() {
    if (!commentContent.trim()) {
      toast.error("Erreur", {
        description: "Le commentaire ne peut pas être vide.",
      });
      return;
    }

    if (!user?.id) {
      toast.error("Erreur", {
        description: "Vous devez être connecté pour commenter.",
      });
      return;
    }

    const data = {
      content: commentContent.trim(),
    };

    const result = CommentSchema.safeParse(data);

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
      setIsSubmitting(true);

      const newComment = await createCommentClient(postId, result.data);

      console.log("newComment", newComment);

      // Réinitialiser le formulaire
      setCommentContent("");

      // Callback pour rafraîchir les commentaires
      if (onCommentAdded) {
        onCommentAdded();
      }

      toast.success("Succès", {
        description: "Commentaire publié avec succès !",
      });

    } catch (error) {
      toast.error("Erreur critique", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue lors de la publication.",
      });

      console.error("Erreur lors de la publication du commentaire :", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fonction pour gérer la sélection d'emoji
  const handleEmojiSelect = (emoji: string) => {
    setCommentContent(prev => prev + emoji);
    setIsEmojiOpen(false);
  };

  // Fonction pour gérer la sélection de GIF
  const handleGifSelect = (gif: { url: string }) => {
    // Pour l'instant, on ajoute juste l'URL du GIF au commentaire
    // Vous pourriez vouloir implémenter un système de média plus sophistiqué
    setCommentContent(prev => prev + ` ${gif.url}`);
  };

  // Fonction pour gérer l'appui sur Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <div className="w-full flex items-center gap-2 p-2">
      {/* Input principal */}
      <div className="flex-1 relative">
        <Input
          className="border-[var(--detailMinimal)] pr-10"
          type="text"
          placeholder="Ajouter un commentaire..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
        />
      </div>

      {/* Bouton Emoji */}
      <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="border border-[var(--detailMinimal)] p-2 flex items-center justify-center"
            disabled={isSubmitting}
          >
            <FaRegFaceSmileBeam className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
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

      {/* Bouton GIF */}
      <GifPopover
        apiKey={GIPHY_API_KEY!} // Remplacez par votre clé API Giphy
        onSelect={handleGifSelect}
      />

      {/* Bouton Envoyer */}
      <Button
        onClick={handleCommentSubmit}
        disabled={!commentContent.trim() || isSubmitting}
        size="sm"
        className="px-3"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default InputComment;