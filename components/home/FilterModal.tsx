import { X, ChevronDown, UserCircle2, Building2 } from "lucide-react";
import { useState } from "react";
import { SPORTS } from "@/lib/sports";
import { getSportIconUrl } from "@/lib/sports";

interface FilterModalProps {
  onClose: () => void;
  selectedSport: string | null;
  setSelectedSport: (sportId: string | null) => void;
  radius: number;
  setRadius: (r: number) => void;
  filterType: "ALL" | "PRIVATE" | "ORGANIZER";
  setFilterType: (type: "ALL" | "PRIVATE" | "ORGANIZER") => void;
  dateFilter: "ALL" | "TODAY" | "TOMORROW" | "WEEK";
  setDateFilter: (val: "ALL" | "TODAY" | "TOMORROW" | "WEEK") => void;
  timeFilter: "ALL" | "MORNING" | "AFTERNOON" | "EVENING";
  setTimeFilter: (val: "ALL" | "MORNING" | "AFTERNOON" | "EVENING") => void;
}

export default function FilterModal({
  onClose,
  selectedSport,
  setSelectedSport,
  radius,
  setRadius,
  filterType,
  setFilterType,
  dateFilter,
  setDateFilter,
  timeFilter,
  setTimeFilter,
}: FilterModalProps) {
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-[#0C0C0E] z-[70] rounded-t-[2rem] border-t border-[#222226] transform transition-transform pb-safe-or-4 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 pt-6 shrink-0 border-b border-[#222226] relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#222226] rounded-full"></div>
          <h3 className="text-xl font-black text-white tracking-tight">Filtri Ricerca</h3>
          <button onClick={onClose} className="bg-[#16161A] p-2 rounded-full text-[#8E8E93] active:bg-[#222226] hover:text-white transition-colors border border-[#222226]">
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable Body */}
        <div className="overflow-y-auto hide-scrollbar px-5 py-4 flex-1">
          
          {/* Sport Filter Custom Combobox */}
          <div className="mb-8">
            <label className="font-bold text-[#8E8E93] mb-3 block text-sm">Sport</label>
            <div className="relative">
              <button
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                className="w-full flex items-center justify-between bg-[#16161A] border-2 border-[#222226] rounded-[12px] py-2 pl-4 pr-2 text-white font-bold text-[14px] outline-none focus:border-[#CCFF00] transition-colors"
              >
                <span className="flex items-center gap-3">
                  {selectedSport 
                    ? <><span className="flex items-center text-[#CCFF00]"><img src={getSportIconUrl(selectedSport)} alt="" className="w-5 h-5 object-contain" /></span> {SPORTS.find(s => s.id === selectedSport)?.label}</> 
                    : <><span className="text-xl">🏅</span> Tutti gli sport</>
                  }
                </span>
                <div className="w-9 h-9 bg-[#222226] rounded-lg flex items-center justify-center shrink-0">
                  <ChevronDown className={`text-[#8E8E93] transition-transform ${isSportDropdownOpen ? 'rotate-180' : ''}`} size={16} strokeWidth={2.5} />
                </div>
              </button>
              
              {isSportDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#16161A] border border-[#222226] shadow-xl rounded-[12px] z-50 overflow-hidden flex flex-col">
                  <div className="max-h-[220px] overflow-y-auto hide-scrollbar p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => { setSelectedSport(null); setIsSportDropdownOpen(false); }}
                      className={`flex items-center gap-3 py-2.5 px-3 text-left rounded-lg font-bold text-[14px] transition-colors ${!selectedSport ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 'text-white hover:bg-[#222226]'}`}
                    >
                      <span className="text-xl">🏅</span> Tutti gli sport
                    </button>
                    {SPORTS.map(sport => (
                      <button
                        key={sport.id}
                        onClick={() => { setSelectedSport(sport.id); setIsSportDropdownOpen(false); }}
                        className={`flex items-center gap-3 py-2.5 px-3 text-left rounded-lg font-bold text-[14px] transition-colors ${selectedSport === sport.id ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 'text-white hover:bg-[#222226]'}`}
                      >
                        <span className="flex items-center"><img src={getSportIconUrl(sport.id)} alt={sport.label} className="w-5 h-5 object-contain" /></span> {sport.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Distance */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="font-bold text-[#8E8E93] text-sm">Distanza massima</label>
              <span className="text-[#CCFF00] font-black bg-[#CCFF00]/10 px-2.5 py-1 text-sm rounded-[8px]">{radius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={radius} 
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-[#222226] rounded-full appearance-none cursor-pointer accent-[#CCFF00]"
            />
            <div className="flex justify-between text-[11px] text-[#8E8E93] font-bold mt-2">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Date Filter */}
          <div className="mb-8">
            <label className="font-bold text-[#8E8E93] mb-3 block text-sm">Quando vuoi giocare?</label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 snap-x">
              {[
                { id: "ALL", label: "Tutti i giorni", icon: "📅" },
                { id: "TODAY", label: "Oggi", icon: "🔥" },
                { id: "TOMORROW", label: "Domani", icon: "🌅" },
                { id: "WEEK", label: "Questa Settimana", icon: "🗓" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDateFilter(opt.id as any)}
                  className={`shrink-0 snap-start px-4 py-2.5 rounded-[12px] font-bold text-[13px] border transition-all flex items-center gap-2 ${dateFilter === opt.id ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-[#222226] bg-[#16161A] text-white hover:bg-[#222226]'}`}
                >
                  <span className="text-lg">{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div className="mb-8">
            <label className="font-bold text-[#8E8E93] mb-3 block text-sm">Fascia oraria</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "ALL", label: "Qualsiasi orario", icon: "🕒" },
                { id: "MORNING", label: "Mattina", icon: "☕️", desc: "06:00 - 13:00" },
                { id: "AFTERNOON", label: "Pomeriggio", icon: "☀️", desc: "13:00 - 19:00" },
                { id: "EVENING", label: "Sera", icon: "🌙", desc: "19:00 - 06:00" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTimeFilter(opt.id as any)}
                  className={`p-3 rounded-[12px] border font-bold text-[13px] transition-all flex flex-col items-start gap-1 ${timeFilter === opt.id ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-[#222226] bg-[#16161A] text-white hover:bg-[#222226]'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{opt.icon}</span> {opt.label}
                  </div>
                  {opt.desc && <span className={`text-[10px] ${timeFilter === opt.id ? 'text-[#CCFF00]/70' : 'text-[#8E8E93]'}`}>{opt.desc}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Organizer Type */}
          <div className="mb-2">
            <label className="font-bold text-[#8E8E93] mb-3 block text-sm">Tipo Organizzatore</label>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => setFilterType("ALL")} className={`p-3.5 rounded-[12px] border text-[13px] font-bold flex items-center justify-between transition-colors ${filterType === 'ALL' ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-[#222226] bg-[#16161A] text-white hover:bg-[#222226]'}`}>
                Tutti gli eventi
                {filterType === 'ALL' && <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />}
              </button>
              <button onClick={() => setFilterType("PRIVATE")} className={`p-3.5 rounded-[12px] border text-[13px] font-bold flex items-center justify-between gap-2 transition-colors ${filterType === 'PRIVATE' ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-[#222226] bg-[#16161A] text-white hover:bg-[#222226]'}`}>
                <div className="flex items-center gap-2"><UserCircle2 size={16} /> Da Privati</div>
                {filterType === 'PRIVATE' && <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />}
              </button>
              <button onClick={() => setFilterType("ORGANIZER")} className={`p-3.5 rounded-[12px] border text-[13px] font-bold flex items-center justify-between gap-2 transition-colors ${filterType === 'ORGANIZER' ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]' : 'border-[#222226] bg-[#16161A] text-white hover:bg-[#222226]'}`}>
                <div className="flex items-center gap-2"><Building2 size={16} /> Da Strutture</div>
                {filterType === 'ORGANIZER' && <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Button */}
        <div className="p-5 pt-3 shrink-0 border-t border-[#222226] bg-[#0C0C0E]">
          <button onClick={onClose} className="w-full bg-[#CCFF00] text-black font-black text-[15px] py-3.5 rounded-[24px] shadow-sm active:bg-[#a6d100] transition-colors">
            Applica filtri
          </button>
        </div>
      </div>
    </>
  );
}
