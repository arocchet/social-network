import { SidebarProvider } from "@/components/ui/sidebar";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="flex h-screen w-screen flex-col bg-[var(--bgLevel1)]">
                {children}
            </body>
        </html>
    );
}