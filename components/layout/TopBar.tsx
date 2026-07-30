"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, ChevronLeft } from "lucide-react";
import { getSportDetails } from "@/lib/sports";

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  const isHidden = ["/login", "/register", "/onboarding"].some(p => pathname?.startsWith(p));

  useEffect(() => {
    if (session?.user && !isHidden) {
      fetch('/api/notifications/unread-count')
        .then(res => res.json())
        .then(data => {
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(console.error);
    }
  }, [session, pathname, isHidden]);

  if (isHidden) return null;

  const isMainPage = ["/", "/categories", "/circles", "/dashboard"].includes(pathname);

  // Dynamic Title Logic
  const getPageTitle = () => {
    if (pathname === "/events/new") {
      return "Crea Evento";
    }
    if (pathname.startsWith("/events/") && pathname.endsWith("/edit")) {
      return "Modifica Evento";
    }
    if (pathname.startsWith("/events/")) {
      return "Dettaglio Partita";
    }
    if (pathname.startsWith("/categories/")) {
      const sportId = pathname.split("/")[2];
      const sport = getSportDetails(sportId);
      return sport ? sport.label : "Categoria";
    }
    if (pathname.startsWith("/profile/")) {
      return "Profilo";
    }
    if (pathname === "/settings") {
      return "Impostazioni";
    }
    if (pathname === "/settings/profile") {
      return "Modifica Profilo";
    }
    if (pathname === "/settings/preferences") {
      return "Preferenze";
    }
    if (pathname === "/notifications") {
      return "Notifiche";
    }
    return "GameInApp";
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0C0C0E]/90 backdrop-blur-xl border-b border-[#222226] z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2 min-w-[100px]">
        {!isMainPage && (
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 rounded-full active:bg-[#16161A] text-white hover:text-[#CCFF00] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {isMainPage && (
          <span className="text-base font-black text-white tracking-wider bg-gradient-to-r from-white to-[#CCFF00] bg-clip-text text-transparent">
            GAMEINAPP
          </span>
        )}
      </div>

      {!isMainPage && (
        <span className="text-[15px] font-black text-white absolute left-1/2 -translate-x-1/2 truncate max-w-[180px]">
          {getPageTitle()}
        </span>
      )}

      <div className="min-w-[100px] flex justify-end">
        <Link 
          href="/notifications" 
          className="relative p-2 bg-[#16161A] border border-[#222226] rounded-full text-white active:bg-[#222226] hover:text-[#CCFF00] transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#16161A] animate-pulse"></span>
          )}
        </Link>
      </div>
    </header>
  );
}
