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
  const isStructure = role === 'STRUTTURA' || role === 'ORGANIZER';
  const color = isStructure ? '#00F0FF' : '#CCFF00';
  const label = isStructure ? 'Struttura Verificata' : 'Privato';
  const bgClass = isStructure ? 'bg-[#00F0FF] text-black' : 'bg-[#CCFF00] text-black';

  return (
    <div className="px-5 mb-5">
      <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">Organizzatore</h3>
      <Link href={`/profile/${id}`} className="flex items-center justify-between p-3 -mx-3 rounded-2xl active:bg-[#16161A] transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${bgClass} rounded-full flex justify-center items-center font-bold text-lg`}>
            {name?.charAt(0)}{surname?.charAt(0)}
          </div>
          <div>
            <p className="text-[14px] font-bold text-white leading-tight flex items-center gap-1.5">
              {name || "Utente"} {surname || ""}
              {isStructure && (
                <Star size={12} className="fill-[#00F0FF] text-[#00F0FF]" />
              )}
            </p>
            <p className="text-[12px] font-bold" style={{ color }}>
              {label}
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-[#8E8E93]" />
      </Link>
    </div>
  );
}
