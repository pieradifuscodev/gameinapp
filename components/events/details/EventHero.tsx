"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventHeroProps {
  imageUrl: string;
  sportLabel: string;
}

export function EventHero({ imageUrl, sportLabel }: EventHeroProps) {
  return (
    <div className="w-full bg-[#0C0C0E] flex flex-col shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222226] bg-[#0C0C0E]/90 backdrop-blur-xl sticky top-0 z-50 pt-[max(env(safe-area-inset-top),12px)]">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 rounded-full active:bg-[#16161A] transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <span className="text-[15px] font-black uppercase tracking-tight text-white">Dettagli Evento</span>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
}
