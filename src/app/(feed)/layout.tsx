import { PostProvider } from "../context/post-context";
import { UserProvider } from "../context/user-context";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
            <PostProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </PostProvider>
        </div>
    );
}