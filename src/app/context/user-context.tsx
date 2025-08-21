'use client';
import React, { createContext, useContext } from "react";
import { useUser } from "@/hooks/use-user-data";
import { UserPublic } from "@/lib/schemas/user";

interface UserContextType {
    user: UserPublic | null;
    loading: boolean;
    error: any;
    refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const { user, loading, error, refetch } = useUser()

    return (
        <UserContext.Provider value={{ user, loading, error, refetch }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext doit être utilisé dans UserProvider");
    }
    return context;
};
