import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EventInfoCardsProps {
  dateStart: Date;
  gymName: string | null;
  location: string | null;
  gymAddress: string | null;
  participantsCount: number;
  maxPlayers: number;
  spotsLeft: number;
  isFull: boolean;
}

export function EventInfoCards({ 
  dateStart, 
  gymName, 
  location, 
  gymAddress, 
  participantsCount, 
  maxPlayers, 
  spotsLeft, 
  isFull 
}: EventInfoCardsProps) {
  
  const fillPct = Math.min((participantsCount / maxPlayers) * 100, 100);

  return (
    <div className="px-5 mb-5 flex flex-col">
      {/* Data e Ora */}
      <div className="flex items-center gap-4 py-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
          <Calendar size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Data e Ora</p>
          <p className="text-[14px] font-bold text-slate-900 leading-tight">
            {new Date(dateStart).toLocaleString('it-IT', { 
              weekday: 'short', 
              day: '2-digit', 
              month: 'long', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* Struttura */}
      <div className="flex items-center gap-4 py-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
          <MapPin size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Struttura</p>
          <p className="text-[14px] font-bold text-slate-900 truncate leading-tight">{gymName || location}</p>
          {gymAddress && <p className="text-[12px] text-slate-500 truncate mt-0.5">{gymAddress}</p>}
        </div>
      </div>

      {/* Partecipanti */}
      <div className="flex items-center gap-4 py-3">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
          <Users size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-end mb-1">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Partecipanti</p>
              <p className="text-[14px] font-bold text-slate-900 leading-tight">
                {participantsCount} iscritti
              </p>
            </div>
            <span className={`text-[12px] font-bold ${spotsLeft <= 2 ? 'text-red-500' : 'text-slate-900'}`}>
              {isFull ? 'Completo' : `Max ${maxPlayers}`}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-slate-900'}`} 
              style={{ width: `${fillPct}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
