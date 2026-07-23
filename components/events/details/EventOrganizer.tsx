import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EventOrganizerProps {
  name: string | null;
  surname: string | null;
  role: string;
}

export function EventOrganizer({ name, surname, role }: EventOrganizerProps) {
  return (
    <div className="px-5 mb-5">
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Organizzatore</h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex justify-center items-center font-bold text-lg">
          {name?.charAt(0)}{surname?.charAt(0)}
        </div>
        <div>
          <p className="text-[14px] font-bold text-slate-900 leading-tight">{name || "Utente"} {surname || ""}</p>
          <p className="text-[12px] text-slate-500">{role === 'PLAYER' ? 'Privato' : 'Struttura'}</p>
        </div>
      </div>
    </div>
  );
}
