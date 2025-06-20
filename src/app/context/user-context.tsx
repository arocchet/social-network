'use client';
import React, { createContext, useContext } from "react";
import { UserInfoProfile } from "@/lib/types/types";
import { useUser } from "@/hooks/use-user-data";

interface UserContextType {
    user: UserInfoProfile | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useUser()

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("usePostContext doit être utilisé dans PostProvider");
    }
    return context;
};
