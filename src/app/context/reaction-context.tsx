"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { ReactionType } from "@/lib/schemas/reaction";

interface ReactionContext {
  reactionMap: Record<string, ReactionType | null>;
  setReactionMap: React.Dispatch<
    React.SetStateAction<Record<string, ReactionType | null>>
  >;
  reactionCounts: Record<string, number>;
  handleReactionChange: (
    contentId: string,
    reaction: ReactionType | null,
    contentType: string
  ) => void;
  initializeReactionCount: (contentId: string, count: number) => void; // ✅ NOUVEAU
}

const ReactionContext = createContext<ReactionContext | undefined>(undefined);

export const ReactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reactionMap, setReactionMap] = useState<
    Record<string, ReactionType | null>
  >({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
    {}
  );

  // ✅ NOUVELLE FONCTION - Initialise les compteurs
  const initializeReactionCount = useCallback(
    (contentId: string, count: number) => {
      setReactionCounts((prev) => {
        if (prev[contentId] === count) {
          return prev;
        }
        return {
          ...prev,
          [contentId]: count,
        };
      });
    },
    []
  );

  const handleReactionChange = (
    contentId: string,
    reaction: ReactionType | null,
    contentType: string
  ) => {
    const prevReaction = reactionMap[contentId];

    setReactionMap((prev) => ({
      ...prev,
      [contentId]: reaction,
    }));

    // ✅ MISE À JOUR DU COMPTEUR EN TEMPS RÉEL
    setReactionCounts((prev) => {
      const currentCount = prev[contentId] || 0;
      let newCount = currentCount;

      if (prevReaction && !reaction) {
        // Suppression d'une réaction
        newCount = Math.max(0, currentCount - 1);
      } else if (!prevReaction && reaction) {
        // Ajout d'une réaction
        newCount = currentCount + 1;
      }

      return {
        ...prev,
        [contentId]: newCount,
      };
    });
  };

  return (
    <ReactionContext.Provider
      value={{
        reactionMap,
        setReactionMap,
        reactionCounts,
        handleReactionChange,
        initializeReactionCount,
      }}
    >
      {children}
    </ReactionContext.Provider>
  );
};

export const useReactionContext = () => {
  const context = useContext(ReactionContext);
  if (!context) {
    throw new Error(
      "useReactionContext doit être utilisé dans ReactionProvider"
    );
  }
  return context;
};
