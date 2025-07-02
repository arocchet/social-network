'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { useInfinitePosts } from "@/hooks/use-post-data";
import { Post } from "@/lib/schemas/post/";

interface PostContextProps {
    allposts: Post[];
    setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean | undefined;
    error: any;
    hasMore: boolean
    loadMore: () => Promise<(Post[] | undefined)[] | undefined>;

}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {

    const { posts, loadMore, loading, hasMore, error } = useInfinitePosts();
    const [allposts, setAllPosts] = useState<Post[]>((posts ?? []).filter((p): p is Post => p !== undefined));

    useEffect(() => {
        setAllPosts((posts ?? []).filter((p): p is Post => p !== undefined));
    }, [posts]);


    return (
        <PostContext.Provider value={{ allposts, setAllPosts, loading, error, loadMore, hasMore }}>
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
