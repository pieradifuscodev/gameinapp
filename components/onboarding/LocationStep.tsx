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
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
        <MapPin size={16} className="text-slate-700" /> Posizione
      </h2>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center flex flex-col items-center">
        <MapPin size={32} className="text-slate-400 mb-2" />
        <p className="text-sm text-slate-600 mb-4 font-medium">
          {isOrganizer 
            ? "Dove si trova la tua struttura sportiva?" 
            : "Imposta la tua posizione per trovare partite vicino a te."}
        </p>
        <button 
          onClick={getGPS}
          className="px-4 py-2 bg-white text-primary font-bold rounded-lg text-sm active:scale-95 transition-transform shadow-sm border border-slate-200 hover:bg-slate-50"
        >
          {loading ? "Rilevamento..." : "Rileva Posizione GPS"}
        </button>
      </div>

      {latitude && longitude && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center gap-2 text-green-700">
          <CheckCircle2 size={18} />
          <span className="text-xs font-bold">Posizione rilevata con successo!</span>
        </div>
      )}

      <div className="mt-auto pt-4 flex gap-2">
        <button onClick={onBack} className="w-1/3 py-3.5 bg-white text-slate-700 rounded-xl font-bold text-base active:scale-[0.98] border border-slate-200 hover:bg-slate-50">
          Indietro
        </button>
        <button 
          onClick={onComplete}
          disabled={loading || !latitude}
          className={`w-2/3 py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-sm active:scale-[0.98] transition-transform ${
            !latitude ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
        >
          {loading ? "Salvataggio..." : "Completa Profilo"}
        </button>
      </div>
    </div>
  );
}
