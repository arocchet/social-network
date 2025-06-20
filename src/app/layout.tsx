import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "../../config/site";
import { geistMono, geistSans } from "../../config/font";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./context/user-context";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: "Social network",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning className="antialiased bg-[var(--bgLevel1)]">
        <ThemeProvider attribute="class" defaultTheme="light">
          <UserProvider>
            {children}
          </UserProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
