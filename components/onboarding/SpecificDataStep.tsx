import { Activity, Building2 } from "lucide-react";
import { SPORTS } from "@/lib/sports";
import { getSportIconUrl } from "@/lib/sports";

interface SpecificDataStepProps {
  isOrganizer: boolean;
  companyName: string;
  setCompanyName: (v: string) => void;
  vatNumber: string;
  setVatNumber: (v: string) => void;
  favoriteSports: string[];
  toggleSport: (sport: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SpecificDataStep({
  isOrganizer,
  companyName, setCompanyName,
  vatNumber, setVatNumber,
  favoriteSports, toggleSport,
  onNext, onBack
}: SpecificDataStepProps) {
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="flex flex-col gap-4 flex-1">
      {isOrganizer ? (
        <>
          <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Building2 size={16} style={{ color: accentColor }} /> Dati Aziendali
          </h2>
          <div>
            <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Nome Struttura o Società *</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Partita IVA *</label>
            <input 
              type="text" 
              value={vatNumber} 
              onChange={e => setVatNumber(e.target.value)} 
              className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-accent"
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Activity size={16} style={{ color: accentColor }} /> I tuoi Sport
          </h2>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[280px] hide-scrollbar pb-2">
            {SPORTS.map(sport => {
              const isSelected = favoriteSports.includes(sport.id);
              return (
                <button
                  key={sport.id}
                  onClick={() => toggleSport(sport.id)}
                  type="button"
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl font-black uppercase tracking-wider text-[11px] transition-all active:scale-95 border"
                  style={{
                    backgroundColor: isSelected ? accentColor : '#0C0C0E',
                    color: isSelected ? '#000000' : '#8E8E93',
                    borderColor: isSelected ? accentColor : '#222226'
                  }}
                >
                  <span className="flex items-center" style={{ color: isSelected ? '#000000' : '#8E8E93' }}>
                    <img src={getSportIconUrl(sport.id)} alt={sport.label} className="w-4 h-4 object-contain" />
                  </span>
                  <span>{sport.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onBack} 
          className="w-1/3 py-3.5 bg-transparent text-white rounded-xl font-black uppercase tracking-wider text-xs active:scale-[0.98] border border-[#222226] hover:bg-[#0C0C0E] transition-all"
        >
          Indietro
        </button>
        <button 
          onClick={onNext}
          className="w-2/3 py-3.5 rounded-xl text-black font-black uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-all"
          style={{ backgroundColor: accentColor }}
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
