"use client";

import { Users, Minus, Plus } from "lucide-react";

interface PlayerCounterProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  isOrganizer?: boolean;
}

export function PlayerCounter({ value, onChange, error, isOrganizer = false }: PlayerCounterProps) {
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="bg-[#16161A] p-4 rounded-xl border border-[#222226] shadow-sm flex items-center justify-between">
      <div>
        <h3 className="font-black text-white flex items-center gap-1.5 uppercase tracking-wide text-xs">
          <Users size={16} style={{ color: accentColor }} /> Giocatori
        </h3>
        <p className="text-[11px] text-[#8E8E93] font-bold mt-0.5">Totale partecipanti richiesti</p>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => onChange(Math.max(1, value - 1))}
            className="w-8 h-8 rounded-full bg-[#0C0C0E] border border-[#222226] flex items-center justify-center active:bg-[#16161A] transition-colors"
          >
            <Minus size={16} className="text-white" />
          </button>
          <span className="text-lg font-black text-white w-6 text-center">{value}</span>
          <button 
            type="button" 
            onClick={() => onChange(Math.min(30, value + 1))}
            className="w-8 h-8 rounded-full bg-[#0C0C0E] border border-[#222226] flex items-center justify-center active:bg-[#16161A] transition-colors"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
      </div>
    </div>
  );
}
