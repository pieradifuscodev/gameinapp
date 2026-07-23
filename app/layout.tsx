import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameInApp",
  description: "Organizza e partecipa a eventi sportivi amatoriali vicino a te.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Extends layout into the safe areas (notch, home indicator)
  viewportFit: "cover",
};

import { Providers } from "./providers";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        h-[100dvh]       → dynamic viewport height (handles mobile browser chrome)
        overflow-hidden  → prevents body scroll; only <main> scrolls
        flex flex-col    → stacks <main> + <BottomNav> vertically
        overscroll-none  → no rubber-band bleed on iOS
      */}
      <body className="h-[100dvh] overflow-hidden flex flex-col bg-gray-50 text-gray-900 overscroll-none">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "16px",
                background: "#1f2937",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: { primary: "#4ade80", secondary: "#fff" },
              },
            }}
          />
          {/*
            flex-1          → fills all space above BottomNav
            overflow-y-auto → scrollable content area
            hide-scrollbar  → native feel, no visible scrollbar
            scroll-touch    → momentum scrolling on iOS
            overscroll-none → contained bounce
          */}
          <main className="flex-1 overflow-y-auto hide-scrollbar scroll-touch overscroll-none flex flex-col">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
