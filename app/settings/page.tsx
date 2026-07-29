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
    { label: "Preferenze", icon: <Settings2 size={20} className="text-slate-600" />, href: "/settings/preferences" },
    { label: "Notifiche", icon: <Bell size={20} className="text-slate-600" />, href: "/settings/notifications" },
    { label: "Privacy", icon: <ShieldCheck size={20} className="text-slate-600" />, href: "/settings/privacy" },
    { label: "Informazioni", icon: <FileText size={20} className="text-slate-600" />, href: "/settings/about" },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative pb-safe">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-base font-bold text-slate-900">Impostazioni</h1>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      <div className="flex-1 px-4 pt-6 pb-24 overflow-y-auto">
        
        {/* Avatar e Dati */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 mb-3 overflow-hidden flex items-center justify-center shadow-sm p-0.5">
            {u.avatar ? (
              <img src={u.avatar} alt="Avatar" className="w-20 h-20 object-cover rounded-full shadow-sm" />
            ) : (
              <span className="text-2xl font-semibold text-slate-700">{getInitials()}</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
          <Link href="/settings/profile" className="text-sm font-semibold text-slate-500 mt-1 hover:text-slate-900 transition-colors">
            Modifica profilo
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col border-t border-slate-100">
          {MENU_ITEMS.map((item, i) => (
            <Link 
              href={item.href} 
              key={i}
              className="flex items-center justify-between py-4 border-b border-slate-100 active:bg-slate-50 transition-colors px-1"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-[15px] text-slate-900">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-between w-full py-4 border-b border-slate-100 active:bg-slate-50 transition-colors px-1"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-500" />
              <span className="font-semibold text-[15px] text-red-500">Esci dall'account</span>
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
