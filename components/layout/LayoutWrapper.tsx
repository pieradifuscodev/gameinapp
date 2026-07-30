"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = ["/login", "/register", "/onboarding"].some(p => pathname?.startsWith(p));

  return (
    <>
      {!isAuthPage && <TopBar />}
      <main className={`flex-1 overflow-y-auto hide-scrollbar scroll-touch overscroll-none flex flex-col ${!isAuthPage ? "pt-14 pb-16" : ""}`}>
        {children}
      </main>
      {!isAuthPage && <BottomNav />}
    </>
  );
}
