'use client';
import React, { createContext, useContext, useState } from "react";
import { ReactionType } from "@/lib/schemas/reaction";

interface ReactionContext {
    reactionMap: Record<string, ReactionType | null>
    setReactionMap: React.Dispatch<React.SetStateAction<Record<string, "LIKE" | "DISLIKE" | "LOVE" | "LAUGH" | "SAD" | "ANGRY" | null>>>
    handleReactionChange: (storyId: string, reaction: ReactionType | null) => void
}

const ReactionContext = createContext<ReactionContext | undefined>(undefined);

export const ReactionProvider = ({ children }: { children: React.ReactNode }) => {

    const [reactionMap, setReactionMap] = useState<Record<string, ReactionType | null>>({});

    const handleReactionChange = (storyId: string, reaction: ReactionType | null) => {
        setReactionMap((prev) => ({
            ...prev,
            [storyId]: reaction,
        }));
    };

    return (
        <ReactionContext.Provider value={{ reactionMap, setReactionMap, handleReactionChange }}>
            {children}
        </ReactionContext.Provider>
    );
};

export const useReactionContext = () => {
    const context = useContext(ReactionContext);
    if (!context) {
        throw new Error("useReactionContext doit être utilisé dans UserProvider");
    }
    return context;
};