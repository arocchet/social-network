import { PostProvider } from "../context/post-context";
import { ReactionProvider } from "../context/reaction-context";
import { UserProvider } from "../context/user-context";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
            <PostProvider>
                <ReactionProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </ReactionProvider>
            </PostProvider>
        </div>
    );
}