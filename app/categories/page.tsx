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
    <div className="flex flex-col h-full bg-[#0C0C0E] relative pb-safe min-h-screen">


      <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {SPORTS.map((cat, i) => (
            <Link
              href={`/categories/${cat.id}`}
              key={cat.id}
              className="relative overflow-hidden rounded-[12px] aspect-[1.3] shadow-md shadow-[#CCFF00]/10 transition-transform active:scale-95 bg-[#16161A] border border-[#CCFF00]/50"
            >
              <Image
                src={`/images/sports/${cat.imageId}_mockup.png`}
                alt={cat.label}
                fill
                className="object-cover opacity-90"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/40 to-transparent z-10" />
              <h3 className="absolute bottom-3 left-3 text-white font-black text-[17px] z-20 tracking-tight uppercase">
                {cat.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
