"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutGrid, Plus, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user && pathname !== '/notifications') {
      fetch('/api/notifications/unread-count')
        .then(res => res.json())
        .then(data => {
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(console.error);
    } else if (pathname === '/notifications') {
      setUnreadCount(0);
    }
  }, [session, pathname]);

  // Hide on auth/onboarding pages
  const isHidden = ["/login", "/register", "/onboarding", "/events/new"].some(p => pathname?.startsWith(p));

  if (isHidden) return null;

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link 
        href={href}
        className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-95 ${
          isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <div className={`relative p-1 rounded-xl transition-colors ${isActive ? "bg-blue-50" : ""}`}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          {href === '/notifications' && unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <span className={`text-[10px] mt-0.5 tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="pb-safe bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.02)] shrink-0 z-50 relative">
      <div className="flex justify-between items-center px-4 py-1.5 h-16 relative">
        {/* Left items */}
        <div className="flex gap-4">
          <NavItem href="/" icon={Home} label="Home" />
          <NavItem href="/categories" icon={LayoutGrid} label="Categorie" />
        </div>

        {/* Center Floating Action Button */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2">
          <Link 
            href="/events/new"
            className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 active:scale-90 transition-transform border-4 border-white"
          >
            <Plus size={28} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Right items */}
        <div className="flex gap-4">
          <NavItem href="/notifications" icon={Bell} label="Notifiche" />
          <NavItem href="/dashboard" icon={User} label="Profilo" />
        </div>
      </div>
    </nav>
  );
}
