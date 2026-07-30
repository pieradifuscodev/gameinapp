import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SPORTS } from "@/lib/sports";
import { getSportIconUrl } from "@/lib/sports";

interface SportSelectorProps {
  value: string;
  onChange: (sportId: string) => void;
  error?: string;
  isOrganizer?: boolean;
}

export function SportSelector({ value, onChange, error, isOrganizer = false }: SportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSport = SPORTS.find(s => s.id === value);
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Sport *</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white shadow-sm flex items-center justify-between cursor-pointer focus-within:ring-1 focus-within:ring-offset-0 focus-within:ring-accent"
        style={{ borderColor: isOpen ? accentColor : '#222226' }}
      >
        {selectedSport ? (
          <span className="flex items-center gap-2 font-bold">
            <span style={{ color: accentColor }} className="flex items-center"><img src={getSportIconUrl(selectedSport.id)} alt={selectedSport.label} className="w-[18px] h-[18px] object-contain" /></span> 
            {selectedSport.label}
          </span>
        ) : (
          <span className="text-[#8E8E93] font-medium">Seleziona uno sport...</span>
        )}
        <ChevronDown size={18} className="text-[#8E8E93] transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>
      
      {isOpen && (
        <div className="absolute z-30 mt-1.5 w-full bg-[#16161A] border border-[#222226] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {SPORTS.map(s => (
            <div 
              key={s.id} 
              onClick={() => {
                onChange(s.id);
                setIsOpen(false);
              }}
              className={`px-4 py-3 flex items-center gap-3.5 cursor-pointer hover:bg-[#0C0C0E]/50 transition-colors border-b border-[#222226]/40 last:border-0 ${value === s.id ? "text-white font-bold" : "text-[#8E8E93]"}`}
              style={{ borderLeft: value === s.id ? `3px solid ${accentColor}` : 'none' }}
            >
              <span className="flex items-center" style={{ color: value === s.id ? accentColor : '#8E8E93' }}>
                <img src={getSportIconUrl(s.id)} alt={s.label} className="w-[18px] h-[18px] object-contain" />
              </span> 
              <span className="text-[14px]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
    </div>
  );
}
