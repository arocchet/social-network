import { NavBarMobile } from "@/components/feed/navBar/navBar";
import { Sidebar } from "@/components/feed/navBar/sideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SidebarProvider>
                    {/* Sidebar visible à partir de md (>=768px) */}
                    <div className="hidden md:block fixed top-0 left-0 h-full z-40">
                        <Sidebar />
                    </div>
                    {/* NavBarMobile visible uniquement en-dessous de md (<768px) */}
                    <div className="block md:hidden  fixed bottom-0 left-0 right-0 z-50">
                        <NavBarMobile />
                    </div>
                    <div className="flex min-h-screen w-screen">
                        {/* Contenu principal centré avec compensation pour la sidebar */}
                        <div className="w-full max-w-3xl">
                            {children}
                        </div>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}