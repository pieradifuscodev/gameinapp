"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Search } from "lucide-react";

import { SPORTS } from "@/lib/sports";

const WaveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,144C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
  </svg>
);

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-full bg-white relative pb-safe">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 py-3 flex flex-col gap-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 transition-colors">
            <ChevronLeft size={24} className="text-slate-900" />
          </Link>
          <h1 className="text-base font-bold text-slate-900">Categorie</h1>
          <div className="w-8"></div>
        </div>

        {/* Barra di ricerca opzionale per le categorie */}
        <div className="relative pb-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cerca uno sport..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[14px] text-slate-900 font-medium focus:ring-1 focus:ring-slate-300 outline-none placeholder:text-slate-400"
          />
        </div>
      </header>

      <div className="flex-1 px-4 pt-2 pb-24 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SPORTS.map((cat, i) => (
            <Link 
              href={`/categories/${cat.id}`} 
              key={cat.id}
              className={`relative overflow-hidden rounded-2xl aspect-[1.3] shadow-sm transition-transform active:scale-95 ${cat.color}`}
            >
              {/* Onde sul fondo */}
              <WaveSVG className={`absolute bottom-0 left-0 w-[150%] h-[60%] ${cat.waveColor}`} />

              {/* Forma geometrica astratta sullo sfondo dell'atleta */}
              <div className={`absolute top-2 right-2 w-20 h-24 rotate-12 -skew-x-12 ${cat.shapeColor}`} />

              {/* Nome Sport */}
              <h3 className="absolute top-3 left-3 text-white font-bold text-[15px] z-10 drop-shadow-sm tracking-tight">
                {cat.label}
              </h3>

              {/* Atleta PNG (Da inserire in public/images/sports/) */}
              <div className="absolute -bottom-2 right-0 w-[75%] h-[90%] z-10 flex items-end justify-end">
                <Image
                  src={`/images/sports/${cat.imageId}.png`}
                  alt={cat.label}
                  fill
                  className="object-contain object-bottom-right drop-shadow-xl"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
