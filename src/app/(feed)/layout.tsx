
export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
            {children}
        </div>
    );
}