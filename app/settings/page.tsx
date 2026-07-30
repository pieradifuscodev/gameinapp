"use client";

import { useSession, signOut } from "next-auth/react";
import { ChevronLeft, ChevronRight, Settings2, Bell, ShieldCheck, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SettingsIndexPage() {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return <div className="p-4">Caricamento...</div>;
  }

  const u = session.user as any;
  const fullName = `${u.name || ""} ${u.surname || ""}`.trim() || "Utente";
  
  const getInitials = () => {
    if (u.name && u.surname) return `${u.name[0]}${u.surname[0]}`.toUpperCase();
    if (u.username) return u.username.substring(0, 2).toUpperCase();
    return "U";
  };

  const MENU_ITEMS = [
    { label: "Preferenze", icon: <Settings2 size={20} className="text-[#CCFF00]" />, href: "/settings/preferences" },
    { label: "Notifiche", icon: <Bell size={20} className="text-[#CCFF00]" />, href: "/settings/notifications" },
    { label: "Privacy", icon: <ShieldCheck size={20} className="text-[#CCFF00]" />, href: "/settings/privacy" },
    { label: "Informazioni", icon: <FileText size={20} className="text-[#CCFF00]" />, href: "/settings/about" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] relative pb-safe">
      
      <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
        
        {/* Avatar e Dati */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#16161A] border border-[#222226] mb-3 overflow-hidden flex items-center justify-center shadow-sm p-0.5">
            {u.avatar ? (
              <img src={u.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full shadow-sm" />
            ) : (
              <span className="text-2xl font-black text-white">{getInitials()}</span>
            )}
          </div>
          <h2 className="text-lg font-black text-white">{fullName}</h2>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col border-t border-[#222226]">
          {MENU_ITEMS.map((item, i) => (
            <Link 
              href={item.href} 
              key={i}
              className="flex items-center justify-between py-4 border-b border-[#222226] active:bg-[#16161A] transition-colors px-1"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-bold text-[15px] text-white">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-[#8E8E93]" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-between w-full py-4 border-b border-[#222226] active:bg-[#16161A] transition-colors px-1"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-500" />
              <span className="font-black text-[15px] text-red-500">Esci dall'account</span>
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
