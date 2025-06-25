// context/PostContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAllPosts } from "@/hooks/use-post-data";
import { Post } from "@/lib/schemas/post/base";

interface PostContextProps {
    allposts: Post[];
    setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean;
    error: any;
    refetch: () => Promise<Post[] | undefined>;

}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {

    const { posts, loading, error, refetch } = useAllPosts()
    const [allposts, setAllPosts] = useState<Post[]>(posts ?? []);

    useEffect(() => {
        setAllPosts(posts ?? [])
    }, [posts])

    return (
        <PostContext.Provider value={{ allposts, setAllPosts, loading, error, refetch }}>
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
