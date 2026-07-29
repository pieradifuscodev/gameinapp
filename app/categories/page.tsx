"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Search } from "lucide-react";
import { SportIllustration } from "@/components/ui/SportIllustration";

import { SPORTS } from "@/lib/sports";

const WaveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,144C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
  </svg>
);

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-full bg-white relative pb-safe">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 py-4 flex justify-center border-b border-slate-100">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">Esplora Categorie</h1>
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
              <h3 className="absolute top-3 left-3 text-white font-bold text-[15px] z-20 drop-shadow-md tracking-tight">
                {cat.label}
              </h3>

              {/* Atleta PNG (Da inserire in public/images/sports/) */}
              <div
                className={`absolute ${cat.id === 'PADEL' ? '-top-2 h-[100%]' : '-bottom-2 h-[90%]'} w-[75%] z-10 flex items-end overflow-hidden ${['CALCETTO', 'NUOTO', 'BASKET', 'ARTI_MARZIALI', 'PALLAVOLO', 'BEACH_VOLLEY', 'PADEL'].includes(cat.id)
                  ? 'right-0 justify-end'
                  : 'left-0 justify-start'
                  }`}
              >
                <Image
                  src={`/images/sports/${cat.imageId}.png`}
                  alt={cat.label}
                  fill
                  className={`object-contain drop-shadow-xl ${cat.id === 'PADEL' ? 'object-top scale-110' : 'object-bottom translate-y-2'} ${['CALCETTO', 'NUOTO', 'BASKET', 'ARTI_MARZIALI', 'PALLAVOLO', 'BEACH_VOLLEY', 'PADEL'].includes(cat.id)
                    ? 'object-right translate-x-2'
                    : 'object-left -translate-x-2'
                    } ${['BASKET', 'ARTI_MARZIALI'].includes(cat.id) ? '-scale-x-100' : ''}`}
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
