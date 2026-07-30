"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutGrid, Plus, Circle, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide on auth/onboarding pages and event detail/creation pages
  const isHidden = ["/login", "/register", "/onboarding", "/events/"].some(p => pathname?.startsWith(p));

  if (isHidden) return null;

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link 
        href={href}
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors active:scale-95 relative ${
          isActive ? "text-[#CCFF00]" : "text-[#8E8E93] hover:text-white"
        }`}
        aria-label={label}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#16161A] border-t border-[#222226] z-50 pb-safe">
      <div className="flex justify-around items-center px-4 py-2 max-w-md mx-auto w-full">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/categories" icon={LayoutGrid} label="Categorie" />
        
        {/* Central Plus Button - Styled as a clean outlined icon or filled circle */}
        <Link 
          href="/events/new"
          className="flex items-center justify-center w-10 h-10 border-2 border-[#CCFF00] text-black bg-[#CCFF00] rounded-[12px] active:bg-[#a6d100] transition-colors mx-1"
          aria-label="Crea Evento"
        >
          <Plus size={22} strokeWidth={3} />
        </Link>

        <NavItem href="/circles" icon={Circle} label="Cerchie" />
        <NavItem href="/dashboard" icon={User} label="Profilo" />
      </div>
    </nav>
  );
}
