// app/[locale]/layout.tsx - Version améliorée
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { locales, type Locale, getDictionary } from "@/config/i18n";
import { notFound } from "next/navigation";
import { siteConfig } from "../../../config/site";
import { geistMono, geistSans } from "../../../config/font";
import { DictionaryProvider } from "./context/dictionnary-context";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: "Social network",
  icons: "/favicon.ico",
};

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  // Attendre les paramètres avant de les utiliser
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Charger le dictionnaire une seule fois au niveau du layout
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning className="antialiased bg-[var(--bgLevel1)]">
        <ThemeProvider attribute="class" defaultTheme="light">
          <DictionaryProvider dict={dict} locale={locale}>
            {children}
          </DictionaryProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}