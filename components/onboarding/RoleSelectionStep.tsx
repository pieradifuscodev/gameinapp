import { Activity, Building2 } from "lucide-react";

interface RoleSelectionStepProps {
  role: "SPORTIVO" | "STRUTTURA";
  setRole: (role: "SPORTIVO" | "STRUTTURA") => void;
  onNext: () => void;
}

export function RoleSelectionStep({ role, setRole, onNext }: RoleSelectionStepProps) {
  const currentAccent = role === "STRUTTURA" ? "#00F0FF" : "#CCFF00";

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
        Seleziona Ruolo
      </h2>

      <div className="flex flex-col gap-4">
        {/* SPORTIVO */}
        <div 
          onClick={() => setRole("SPORTIVO")}
          className="p-4 rounded-2xl cursor-pointer border transition-all duration-300"
          style={{
            borderColor: role === "SPORTIVO" ? "#CCFF00" : "#222226",
            backgroundColor: role === "SPORTIVO" ? "rgba(204, 255, 0, 0.08)" : "#0C0C0E"
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div 
              className="p-2 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: role === "SPORTIVO" ? "#CCFF00" : "#16161A",
                color: role === "SPORTIVO" ? "#000000" : "#8E8E93"
              }}
            >
              <Activity size={20} />
            </div>
            <h3 
              className="font-black uppercase tracking-wide text-sm"
              style={{ color: role === "SPORTIVO" ? "#CCFF00" : "#FFFFFF" }}
            >
              Sportivo
            </h3>
          </div>
          <p className="text-xs font-medium pl-12 leading-relaxed text-[#8E8E93]">
            Trova eventi, prenota campi, conosci nuove persone e organizza partite con gli amici.
          </p>
        </div>

        {/* STRUTTURA */}
        <div 
          onClick={() => setRole("STRUTTURA")}
          className="p-4 rounded-2xl cursor-pointer border transition-all duration-300"
          style={{
            borderColor: role === "STRUTTURA" ? "#00F0FF" : "#222226",
            backgroundColor: role === "STRUTTURA" ? "rgba(0, 240, 255, 0.08)" : "#0C0C0E"
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div 
              className="p-2 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: role === "STRUTTURA" ? "#00F0FF" : "#16161A",
                color: role === "STRUTTURA" ? "#000000" : "#8E8E93"
              }}
            >
              <Building2 size={20} />
            </div>
            <h3 
              className="font-black uppercase tracking-wide text-sm"
              style={{ color: role === "STRUTTURA" ? "#00F0FF" : "#FFFFFF" }}
            >
              Organizzatore
            </h3>
          </div>
          <p className="text-xs font-medium pl-12 leading-relaxed text-[#8E8E93]">
            Aggiungi la tua struttura sportiva, ricevi prenotazioni e gestisci i tuoi campi.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="w-full py-4 rounded-xl text-black font-black uppercase tracking-wider text-sm shadow-md active:scale-[0.98] transition-transform"
          style={{ backgroundColor: currentAccent }}
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
