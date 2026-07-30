import { MapPin, CheckCircle2 } from "lucide-react";

interface LocationStepProps {
  isOrganizer: boolean;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  getGPS: () => void;
  onComplete: () => void;
  onBack: () => void;
}

export function LocationStep({
  isOrganizer,
  latitude, longitude,
  loading, getGPS,
  onComplete, onBack
}: LocationStepProps) {
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
        <MapPin size={16} style={{ color: accentColor }} /> Posizione
      </h2>
      
      <div className="bg-[#0C0C0E] p-5 rounded-xl border border-[#222226] text-center flex flex-col items-center">
        <MapPin size={32} className="text-[#8E8E93] mb-3" />
        <p className="text-sm text-[#8E8E93] mb-4 font-bold">
          {isOrganizer 
            ? "Dove si trova la tua struttura sportiva?" 
            : "Imposta la tua posizione per trovare partite vicino a te."}
        </p>
        <button 
          onClick={getGPS}
          type="button"
          className="px-4 py-2.5 bg-transparent font-black uppercase tracking-wider text-xs rounded-xl active:scale-95 transition-transform border"
          style={{
            borderColor: accentColor,
            color: accentColor
          }}
        >
          {loading ? "Rilevamento..." : "Rileva Posizione GPS"}
        </button>
      </div>

      {latitude && longitude && (
        <div className="bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Posizione rilevata con successo!</span>
        </div>
      )}

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onBack} 
          className="w-1/3 py-3.5 bg-transparent text-white rounded-xl font-black uppercase tracking-wider text-xs active:scale-[0.98] border border-[#222226] hover:bg-[#0C0C0E] transition-all"
        >
          Indietro
        </button>
        <button 
          onClick={onComplete}
          disabled={loading || !latitude}
          className="w-2/3 py-3.5 rounded-xl text-black font-black uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? "Salvataggio..." : "Completa Profilo"}
        </button>
      </div>
    </div>
  );
}
