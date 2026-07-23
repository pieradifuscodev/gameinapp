import { Activity, Building2 } from "lucide-react";
import { SPORTS } from "@/lib/sports";

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
  return (
    <div className="flex flex-col gap-4 flex-1">
      {isOrganizer ? (
        <>
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Building2 size={16} className="text-slate-700" /> Dati Aziendali
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nome Struttura o Società *</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Partita IVA *</label>
            <input 
              type="text" 
              value={vatNumber} 
              onChange={e => setVatNumber(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-none" 
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
            <Activity size={16} className="text-slate-700" /> I tuoi Sport
          </h2>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] hide-scrollbar pb-2">
            {SPORTS.map(sport => {
              const isSelected = favoriteSports.includes(sport.id);
              return (
                <button
                  key={sport.id}
                  onClick={() => toggleSport(sport.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-95 border
                    ${isSelected 
                      ? `${sport.pillColor} ${sport.pillText} border-transparent shadow-sm ring-2 ring-primary/20` 
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-none"}`}
                >
                  <span className="text-xl">{sport.icon}</span>
                  <span className="text-xs">{sport.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-auto pt-4 flex gap-2">
        <button onClick={onBack} className="w-1/3 py-3.5 bg-white text-slate-700 rounded-xl font-bold text-base active:scale-[0.98] border border-slate-200 hover:bg-slate-50">
          Indietro
        </button>
        <button 
          onClick={onNext}
          className="w-2/3 py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-sm active:scale-[0.98] transition-transform hover:bg-primary/90"
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
