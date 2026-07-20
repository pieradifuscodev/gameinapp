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
  
  // Funzione per mostrare le iniziali se manca l'avatar
  const getInitials = () => {
    if (u.name && u.surname) return `${u.name[0]}${u.surname[0]}`.toUpperCase();
    if (u.username) return u.username.substring(0, 2).toUpperCase();
    return "U";
  };

  const MENU_ITEMS = [
    { label: "Preferenze", icon: <Settings2 size={20} className="text-gray-600" />, href: "/settings/preferences" },
    { label: "Notifiche", icon: <Bell size={20} className="text-gray-600" />, href: "/settings/notifications" },
    { label: "Privacy", icon: <ShieldCheck size={20} className="text-gray-600" />, href: "/settings/privacy" },
    { label: "Informazioni", icon: <FileText size={20} className="text-gray-600" />, href: "/settings/about" },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative pb-safe">
      {/* Header Semplice */}
      <header className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </Link>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <div className="flex-1 px-5 pt-2 pb-24 overflow-y-auto">
        
        {/* Avatar e Dati */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-3 overflow-hidden flex items-center justify-center shadow-sm">
            {u.avatar ? (
              <Image src={u.avatar} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-gray-500">{getInitials()}</span>
            )}
          </div>
          <h2 className="text-xl font-black text-gray-900">{fullName}</h2>
          <Link href="/settings/profile" className="text-sm font-medium text-primary/80 mt-1 hover:underline">
            Modifica profilo
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-3">
          {MENU_ITEMS.map((item, i) => (
            <Link 
              href={item.href} 
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-semibold text-sm text-gray-800">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-12">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-between w-full p-4 bg-red-50 rounded-2xl active:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <LogOut size={20} className="text-red-600" />
              <span className="font-semibold text-sm text-red-600">Esci dall'account</span>
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
