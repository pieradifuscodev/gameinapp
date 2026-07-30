"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Circle {
  id: string;
  name: string;
}

interface PrivacySettingsProps {
  isPrivate: boolean;
  onPrivacyChange: (isPrivate: boolean) => void;
  circles: Circle[];
  circleId: string;
  onCircleChange: (circleId: string) => void;
  circleError?: string;
  isOrganizer?: boolean;
}

export function PrivacySettings({
  isPrivate,
  onPrivacyChange,
  circles,
  circleId,
  onCircleChange,
  circleError,
  isOrganizer = false
}: PrivacySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="bg-[#16161A] p-4 rounded-xl border border-[#222226] shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-white uppercase tracking-wide text-xs">Evento Privato</h3>
          <p className="text-[11px] text-[#8E8E93] font-bold mt-0.5">Visibile solo alla tua cerchia</p>
        </div>
        <Switch 
          checked={isPrivate} 
          onCheckedChange={onPrivacyChange}
          style={{ backgroundColor: isPrivate ? accentColor : undefined }}
        />
      </div>

      {isPrivate && (
        <div className="mt-2 pt-3 border-t border-[#222226]/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-[11px] font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Seleziona Cerchia *</label>
          {circles.length > 0 ? (
            <div className="relative">
              <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3 text-sm text-white outline-none flex items-center justify-between cursor-pointer"
                style={{ borderColor: isOpen ? accentColor : '#222226' }}
              >
                {circleId ? (
                  <span className="text-white font-bold truncate">
                    {circles.find(c => c.id === circleId)?.name}
                  </span>
                ) : (
                  <span className="text-[#8E8E93] font-medium">Seleziona una cerchia...</span>
                )}
                <ChevronDown size={16} className="text-[#8E8E93] transition-transform flex-shrink-0 ml-2" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
              </div>
              
              {isOpen && (
                <div className="absolute z-30 mt-1.5 w-full bg-[#16161A] border border-[#222226] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {circles.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        onCircleChange(c.id);
                        setIsOpen(false);
                      }}
                      className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#0C0C0E]/50 border-b border-[#222226]/40 last:border-0 truncate ${circleId === c.id ? "text-white font-bold" : "text-[#8E8E93]"}`}
                      style={{ borderLeft: circleId === c.id ? `3px solid ${accentColor}` : 'none' }}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-500/10 text-amber-400 p-3 rounded-lg text-sm flex flex-col gap-2 border border-amber-500/20">
              <div className="flex items-center gap-1.5 font-bold">
                <Info size={16} /> Nessuna cerchia trovata
              </div>
              <p className="text-xs text-amber-400/90 font-medium">Devi appartenere o aver creato almeno una cerchia per organizzare eventi privati.</p>
              <Link href="/circles/new" className="font-black text-xs mt-1 underline" style={{ color: accentColor }}>Crea Cerchia</Link>
            </div>
          )}
          {circleError && <p className="text-red-500 text-xs mt-1.5 font-semibold">{circleError}</p>}
        </div>
      )}
    </div>
  );
}
