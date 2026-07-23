"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SPORTS } from "@/lib/sports";

interface SportSelectorProps {
  value: string;
  onChange: (sportId: string) => void;
  error?: string;
}

export function SportSelector({ value, onChange, error }: SportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSport = SPORTS.find(s => s.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-700 mb-1.5">Sport *</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-sm flex items-center justify-between cursor-pointer focus-within:ring-1 focus-within:border-primary/80 focus-within:ring-primary/80"
      >
        {selectedSport ? (
          <span className="flex items-center gap-2">
            <span className="text-lg">{selectedSport.icon}</span> 
            {selectedSport.label}
          </span>
        ) : (
          <span className="text-gray-400">Seleziona uno sport...</span>
        )}
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {SPORTS.map(s => (
            <div 
              key={s.id} 
              onClick={() => {
                onChange(s.id);
                setIsOpen(false);
              }}
              className={`px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${value === s.id ? "bg-primary/10 text-primary font-bold" : "text-gray-700"}`}
            >
              <span className="text-lg">{s.icon}</span> <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
