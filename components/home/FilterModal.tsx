import { X, ChevronDown, UserCircle2, Building2 } from "lucide-react";
import { useState } from "react";
import { SPORTS } from "@/lib/sports";

interface FilterModalProps {
  onClose: () => void;
  selectedSport: string | null;
  setSelectedSport: (sportId: string | null) => void;
  radius: number;
  setRadius: (r: number) => void;
  filterType: "ALL" | "PRIVATE" | "ORGANIZER";
  setFilterType: (type: "ALL" | "PRIVATE" | "ORGANIZER") => void;
}

export default function FilterModal({
  onClose,
  selectedSport,
  setSelectedSport,
  radius,
  setRadius,
  filterType,
  setFilterType,
}: FilterModalProps) {
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white z-[70] rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transform transition-transform pb-safe-or-4 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 shrink-0 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">Filtri Ricerca</h3>
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full text-gray-500 active:bg-gray-200">
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable Body */}
        <div className="overflow-y-auto hide-scrollbar px-5 py-4 flex-1">
          
          {/* Sport Filter Custom Combobox */}
          <div className="mb-8">
            <label className="font-bold text-gray-700 mb-3 block text-sm">Sport</label>
            <div className="relative">
              <button
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border-2 border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-xl py-1.5 pl-4 pr-1.5 text-gray-900 font-bold text-[14px] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-200"
              >
                <span className="flex items-center gap-3">
                  {selectedSport 
                    ? <><span className="text-xl">{SPORTS.find(s => s.id === selectedSport)?.icon}</span> {SPORTS.find(s => s.id === selectedSport)?.label}</> 
                    : <><span className="text-xl">🏅</span> Tutti gli sport</>
                  }
                </span>
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 transition-colors shrink-0">
                  <ChevronDown className={`text-gray-500 transition-transform ${isSportDropdownOpen ? 'rotate-180' : ''}`} size={16} strokeWidth={2.5} />
                </div>
              </button>
              
              {isSportDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] rounded-xl z-50 overflow-hidden flex flex-col">
                  <div className="max-h-[220px] overflow-y-auto hide-scrollbar p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => { setSelectedSport(null); setIsSportDropdownOpen(false); }}
                      className={`flex items-center gap-3 py-2.5 px-3 text-left rounded-lg font-bold text-[14px] transition-colors ${!selectedSport ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span className="text-xl">🏅</span> Tutti gli sport
                    </button>
                    {SPORTS.map(sport => (
                      <button
                        key={sport.id}
                        onClick={() => { setSelectedSport(sport.id); setIsSportDropdownOpen(false); }}
                        className={`flex items-center gap-3 py-2.5 px-3 text-left rounded-lg font-bold text-[14px] transition-colors ${selectedSport === sport.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span className="text-xl">{sport.icon}</span> {sport.label}
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
              <label className="font-bold text-gray-700 text-sm">Distanza massima</label>
              <span className="text-primary font-black bg-primary/10 px-2.5 py-1 text-sm rounded-md">{radius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={radius} 
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-bold mt-2">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Organizer Type */}
          <div className="mb-2">
            <label className="font-bold text-gray-700 mb-3 block text-sm">Tipo Organizzatore</label>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => setFilterType("ALL")} className={`p-3.5 rounded-xl border-2 text-[13px] font-bold flex items-center justify-between transition-colors ${filterType === 'ALL' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 text-gray-600 active:bg-gray-50'}`}>
                Tutti gli eventi
                {filterType === 'ALL' && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
              <button onClick={() => setFilterType("PRIVATE")} className={`p-3.5 rounded-xl border-2 text-[13px] font-bold flex items-center justify-between gap-2 transition-colors ${filterType === 'PRIVATE' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-100 text-gray-600 active:bg-gray-50'}`}>
                <div className="flex items-center gap-2"><UserCircle2 size={16} /> Da Privati</div>
                {filterType === 'PRIVATE' && <div className="w-2 h-2 rounded-full bg-primary" />}
              </button>
              <button onClick={() => setFilterType("ORGANIZER")} className={`p-3.5 rounded-xl border-2 text-[13px] font-bold flex items-center justify-between gap-2 transition-colors ${filterType === 'ORGANIZER' ? 'border-purple-600 bg-purple-600/10 text-purple-700' : 'border-gray-100 text-gray-600 active:bg-gray-50'}`}>
                <div className="flex items-center gap-2"><Building2 size={16} /> Da Strutture</div>
                {filterType === 'ORGANIZER' && <div className="w-2 h-2 rounded-full bg-purple-600" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Button */}
        <div className="p-5 pt-3 shrink-0 border-t border-gray-100 bg-white">
          <button onClick={onClose} className="w-full bg-primary text-white font-black text-[15px] py-3.5 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
            Applica filtri
          </button>
        </div>
      </div>
    </>
  );
}
