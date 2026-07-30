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
import LayoutWrapper from "@/components/layout/LayoutWrapper";
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
      <body className="h-[100dvh] overflow-hidden flex flex-col bg-[#0C0C0E] text-white overscroll-none">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#16161A",
                color: "#FFFFFF",
                border: "1px solid #222226",
                fontSize: "12px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              },
              success: {
                iconTheme: { primary: "#CCFF00", secondary: "#000000" },
              },
              error: {
                iconTheme: { primary: "#FF3B30", secondary: "#FFFFFF" },
              },
            }}
          />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
