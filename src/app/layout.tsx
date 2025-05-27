import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "../../config/site";
import { geistMono, geistSans } from "../../config/font";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: "Social network",
  icons: "/favicon.ico",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div>
          <div>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

