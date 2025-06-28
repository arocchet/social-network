import { UserProvider } from "../context/user-context";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
            <UserProvider>
                {children}
            </UserProvider>
        </div>
    );
}