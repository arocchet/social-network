"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { ReactionType } from "@/lib/schemas/reaction";

interface ReactionContext {
  reactionMap: Record<string, ReactionType | null>;
  setReactionMap: React.Dispatch<
    React.SetStateAction<Record<string, ReactionType | null>>
  >;
  reactionCounts: Record<string, number>;
  reactionsData: Record<string, any[]>; // Store detailed reactions data
  setReactionsData: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  reactionUpdates: Record<string, number>; // Timestamp of last update for each content
  handleReactionChange: (
    contentId: string,
    reaction: ReactionType | null,
    contentType: string
  ) => void;
  initializeReactionCount: (contentId: string, count: number) => void;
  initializeReactionsData: (contentId: string, reactions: any[]) => void;
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
  const [reactionsData, setReactionsData] = useState<Record<string, any[]>>(
    {}
  );
  const [reactionUpdates, setReactionUpdates] = useState<Record<string, number>>(
    {}
  );

  // ✅ NOUVELLE FONCTION - Initialise les compteurs seulement si pas déjà défini

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


  // Initialize reactions data
  const initializeReactionsData = useCallback(
    (contentId: string, reactions: any[]) => {
      setReactionsData((prev) => ({
        ...prev,
        [contentId]: reactions || [],
      }));
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

    // Just update the timestamp to trigger re-renders

    // Update timestamp to trigger re-renders
    setReactionUpdates(prev => ({
      ...prev,
      [contentId]: Date.now()
    }));
  };

  return (
    <ReactionContext.Provider
      value={{
        reactionMap,
        setReactionMap,
        reactionCounts,
        reactionsData,
        setReactionsData,
        reactionUpdates,
        handleReactionChange,
        initializeReactionCount,
        initializeReactionsData,
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
