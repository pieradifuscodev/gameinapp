import { Activity, Building2 } from "lucide-react";

interface RoleSelectionStepProps {
  role: "SPORTIVO" | "STRUTTURA";
  setRole: (role: "SPORTIVO" | "STRUTTURA") => void;
  onNext: () => void;
}

export function RoleSelectionStep({ role, setRole, onNext }: RoleSelectionStepProps) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
        Seleziona Ruolo
      </h2>

      <div className="flex flex-col gap-3">
        <div 
          onClick={() => setRole("SPORTIVO")}
          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
            role === "SPORTIVO" 
            ? "border-primary bg-primary/5 shadow-sm" 
            : "border-slate-100 hover:border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-full ${role === "SPORTIVO" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
              <Activity size={20} />
            </div>
            <h3 className={`font-black ${role === "SPORTIVO" ? "text-primary" : "text-slate-700"}`}>Sportivo</h3>
          </div>
          <p className={`text-xs font-medium pl-12 leading-relaxed ${role === "SPORTIVO" ? "text-primary/80" : "text-slate-500"}`}>
            Trova eventi, prenota campi, conosci nuove persone e organizza partite con gli amici.
          </p>
        </div>

        <div 
          onClick={() => setRole("STRUTTURA")}
          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
            role === "STRUTTURA" 
            ? "border-primary bg-primary/5 shadow-sm" 
            : "border-slate-100 hover:border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-full ${role === "STRUTTURA" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
              <Building2 size={20} />
            </div>
            <h3 className={`font-black ${role === "STRUTTURA" ? "text-primary" : "text-slate-700"}`}>Organizzatore</h3>
          </div>
          <p className={`text-xs font-medium pl-12 leading-relaxed ${role === "STRUTTURA" ? "text-primary/80" : "text-slate-500"}`}>
            Aggiungi la tua struttura sportiva, ricevi prenotazioni e gestisci i tuoi campi.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 flex justify-end">
        <button 
          onClick={onNext}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-sm active:scale-[0.98] transition-transform"
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
