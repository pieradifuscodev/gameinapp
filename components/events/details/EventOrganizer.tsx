import { Info, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface EventOrganizerProps {
  id: string;
  name: string | null;
  surname: string | null;
  role: string;
}

export function EventOrganizer({ id, name, surname, role }: EventOrganizerProps) {
  return (
    <div className="px-5 mb-5">
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Organizzatore</h3>
      <Link href={`/profile/${id}`} className="flex items-center justify-between p-3 -mx-3 rounded-2xl active:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex justify-center items-center font-bold text-lg">
            {name?.charAt(0)}{surname?.charAt(0)}
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              {name || "Utente"} {surname || ""}
              {role === 'ORGANIZER' && (
                <Star size={12} className="fill-purple-500 text-purple-500" />
              )}
            </p>
            <p className={`text-[12px] font-bold ${role === 'PLAYER' ? 'text-slate-500' : 'text-purple-600'}`}>
              {role === 'PLAYER' ? 'Privato' : 'Struttura Verificata'}
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-400" />
      </Link>
    </div>
  );
}
