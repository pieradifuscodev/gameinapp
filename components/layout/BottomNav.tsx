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

  // Hide on auth/onboarding pages and event detail/creation pages
  const isHidden = ["/login", "/register", "/onboarding", "/events/"].some(p => pathname?.startsWith(p));

  if (isHidden) return null;

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link 
        href={href}
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors active:scale-95 relative ${
          isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
        }`}
        aria-label={label}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        {href === '/notifications' && unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-around items-center px-4 py-2 max-w-md mx-auto w-full">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/categories" icon={LayoutGrid} label="Categorie" />
        
        {/* Central Plus Button - Styled as a clean outlined icon or filled circle */}
        <Link 
          href="/events/new"
          className="flex items-center justify-center w-10 h-10 border-2 border-slate-900 text-slate-900 rounded-xl active:bg-slate-50 transition-colors mx-1"
          aria-label="Crea Evento"
        >
          <Plus size={22} strokeWidth={2.5} />
        </Link>

        <NavItem href="/notifications" icon={Bell} label="Notifiche" />
        <NavItem href="/dashboard" icon={User} label="Profilo" />
      </div>
    </nav>
  );
}
