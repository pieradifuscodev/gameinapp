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
}

export function PrivacySettings({
  isPrivate,
  onPrivacyChange,
  circles,
  circleId,
  onCircleChange,
  circleError
}: PrivacySettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Evento Privato</h3>
          <p className="text-xs text-gray-500 mt-0.5">Visibile solo alla tua cerchia</p>
        </div>
        <Switch 
          checked={isPrivate} 
          onCheckedChange={onPrivacyChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {isPrivate && (
        <div className="mt-2 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seleziona Cerchia *</label>
          {circles.length > 0 ? (
            <div className="relative">
              <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none flex items-center justify-between cursor-pointer"
              >
                {circleId ? (
                  <span className="text-gray-900 truncate">
                    {circles.find(c => c.id === circleId)?.name}
                  </span>
                ) : (
                  <span className="text-gray-400">Seleziona una cerchia...</span>
                )}
                <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} />
              </div>
              
              {isOpen && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {circles.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        onCircleChange(c.id);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0 truncate ${circleId === c.id ? "bg-primary/10 text-primary font-bold" : "text-gray-700"}`}
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex flex-col gap-2 border border-amber-200">
              <div className="flex items-center gap-1.5 font-semibold">
                <Info size={16} /> Nessuna cerchia trovata
              </div>
              <p className="text-xs">Devi appartenere o aver creato almeno una cerchia per organizzare eventi privati.</p>
              <Link href="/circles/new" className="text-primary font-bold text-xs mt-1 underline">Crea Cerchia</Link>
            </div>
          )}
          {circleError && <p className="text-red-500 text-xs mt-1.5">{circleError}</p>}
        </div>
      )}
    </div>
  );
}
