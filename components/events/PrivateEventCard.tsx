import Link from "next/link";
import { Navigation, Banknote, Trophy, Users } from "lucide-react";
import { getSportDetails } from "@/lib/sports";

interface EventData {
  id: string;
  title: string;
  description: string;
  sport: string;
  dateStart: string;
  location: string;
  maxPlayers: number;
  distanceInKm: number;
  price: number | null;
  skillLevel: string | null;
  genderPreference: string | null;
  gym: { id: string; name: string; address: string };
  creator: { id: string; name: string; surname: string; role: string };
  participantsCount?: number;
}

interface Props {
  event: EventData;
}

export default function PrivateEventCard({ event }: Props) {
  const sport = getSportDetails(event.sport);

  // Simulazione partecipanti se non viene ritornato dal DB nella ricerca veloce
  const currentParticipants = event.participantsCount || 1;
  const maxPlayers = event.maxPlayers;
  const fillPct = Math.min(100, Math.round((currentParticipants / maxPlayers) * 100));

  const eventDate = new Date(event.dateStart);
  const formattedDate = eventDate.toLocaleString('it-IT', { day: '2-digit', month: 'short' });
  const formattedTime = eventDate.toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/events/${event.id}`} className="block group shrink-0 w-[280px] snap-start">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 active:bg-slate-50 transition-colors relative overflow-hidden flex flex-col h-full">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className={`text-[10px] font-bold uppercase tracking-wider ${sport.pillText} ${sport.pillColor} px-2 py-1 rounded-lg flex items-center gap-1`}>
            <span className="text-sm">{sport.icon}</span> {sport.label}
          </div>
          <div className="flex items-center text-[10px] font-bold text-slate-600 gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            <Navigation size={10} className="text-slate-400" />
            {event.distanceInKm < 1 ? `${Math.round(event.distanceInKm * 1000)}m` : `${event.distanceInKm.toFixed(1)}km`}
          </div>
        </div>

        {/* ── TITOLO E LUOGO ──────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-start">
          <h3 className="font-bold text-slate-900 text-[17px] leading-tight line-clamp-2 mb-1">
            {event.title}
          </h3>
          <p className="text-[12px] text-slate-500 font-medium truncate flex items-center gap-1">
            📍 {event.gym.name}
          </p>
        </div>

        {/* ── DATA E ORA ─────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 my-3 relative z-10">
          <div className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl flex flex-col items-center justify-center w-[48px] h-[48px] shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase leading-none mt-1">{formattedDate.split(' ')[1]}</span>
            <span className="text-[17px] font-black leading-none">{formattedDate.split(' ')[0]}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-slate-900 leading-none">{formattedTime}</span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">Inizio Partita</span>
          </div>
        </div>

        {/* ── MINI BADGES ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1 mb-3 relative z-10">
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${event.price ? 'bg-slate-100 text-slate-700' : 'bg-green-50 text-green-700'}`}>
            <Banknote size={10} />
            {event.price ? `€ ${event.price.toFixed(2)}` : 'Gratis'}
          </div>
          {event.skillLevel && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700">
              <Trophy size={10} />
              {event.skillLevel}
            </div>
          )}
          {event.genderPreference && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              <Users size={10} />
              {event.genderPreference}
            </div>
          )}
        </div>

        {/* ── FOOTER (Progress Bar) ───────────────── */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 relative z-10 mt-auto">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1.5">
              <span>{currentParticipants}/{maxPlayers} Iscritti</span>
              <span className={fillPct >= 100 ? 'text-red-500' : 'text-slate-900'}>{fillPct >= 100 ? 'Completo' : `${maxPlayers - currentParticipants} liberi`}</span>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${fillPct >= 100 ? 'bg-red-500' : 'bg-slate-900'}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
            {event.creator.name[0]}
          </div>
        </div>

      </div>
    </Link>
  );
}
