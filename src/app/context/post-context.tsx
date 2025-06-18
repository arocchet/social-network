// context/PostContext.tsx
import React, { createContext, useContext } from "react";
import { Post } from "@/lib/types/types";
import { useAllPosts } from "@/hooks/use-post-data";

interface PostContextProps {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {

    const { posts, setPosts, loading, error, refetch: fetchAllPosts } = useAllPosts()

    return (
        <PostContext.Provider value={{ posts, setPosts, loading, error, refetch: fetchAllPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePostContext doit être utilisé dans PostProvider");
    }
    return context;
};
