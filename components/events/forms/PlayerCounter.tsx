"use client";

import { Users, Minus, Plus } from "lucide-react";

interface PlayerCounterProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function PlayerCounter({ value, onChange, error }: PlayerCounterProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
          <Users size={18} className="text-primary/80" /> Giocatori
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Totale partecipanti richiesti</p>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => onChange(Math.max(2, value - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
          <span className="text-lg font-black w-6 text-center">{value}</span>
          <button 
            type="button" 
            onClick={() => onChange(Math.min(30, value + 1))}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>
    </div>
  );
}
