"use client";

import { useState, useCallback } from "react";

interface UseStoryLikesParams {
  storyId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function useStoryLikes({
  storyId,
  initialLiked = false,
  initialCount = 0,
}: UseStoryLikesParams) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    if (loading || !storyId) {
      console.log("Toggle like bloqué:", { loading, storyId });
      return;
    }

    console.log("=== TOGGLE LIKE START ===");
    console.log("Story ID:", storyId);
    console.log("État actuel isLiked:", isLiked);
    console.log("likesCount actuel:", likesCount);

    try {
      setLoading(true);

      // 1. Mise à jour optimiste (on change l'UI avant la réponse serveur)
      const wasLiked = isLiked;
      setIsLiked(!wasLiked);
      setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

      console.log("Appel API vers:", `/api/private/stories/${storyId}/like`);

      // 2. Appel API
      const response = await fetch(`/api/private/stories/${storyId}/like`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse API status:", response.status);

      if (!response.ok) {
        console.error("Réponse non-OK:", response.status, response.statusText);
        // 3. Si erreur, on annule la mise à jour optimiste
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));

        const errorText = await response.text();
        console.error("Détails erreur:", errorText);
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Données reçues:", data);

      // 4. Mise à jour avec la réponse serveur
      if (data.success) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount || 0);
        console.log("Nouvel état:", {
          liked: data.liked,
          count: data.likesCount,
        });
      }
    } catch (error) {
      console.error("=== ERREUR TOGGLE LIKE ===");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      console.error("=========================");
    } finally {
      setLoading(false);
      console.log("=== TOGGLE LIKE END ===");
    }
  }, [storyId, isLiked, likesCount, loading]);

  return {
    isLiked,
    likesCount,
    loading,
    toggleLike,
  };
}
