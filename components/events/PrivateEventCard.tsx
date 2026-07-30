import Link from "next/link";
import { Navigation, Banknote, Trophy, Users } from "lucide-react";
import { getSportDetails, getSportIconUrl } from "@/lib/sports";

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

  const currentParticipants = event.participantsCount || 1;
  const maxPlayers = event.maxPlayers;
  const fillPct = Math.min(100, Math.round((currentParticipants / maxPlayers) * 100));

  const eventDate = new Date(event.dateStart);
  const formattedDate = eventDate.toLocaleString('it-IT', { day: '2-digit', month: 'short' });
  const formattedTime = eventDate.toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/events/${event.id}`} className="block group shrink-0 w-[280px] snap-start">
      <div className="bg-[#16161A] rounded-[12px] p-5 border border-[#222226] shadow-sm hover:border-[#CCFF00]/50 transition-colors relative overflow-hidden flex flex-col h-full">
        
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-2.5 py-1 rounded-[8px] flex items-center gap-1 shadow-sm">
            <span className="text-sm leading-none flex items-center"><img src={getSportIconUrl(sport.id)} alt={sport.label} className="w-3.5 h-3.5 object-contain" /></span> {sport.label}
          </div>
          <div className="flex items-center text-[10px] font-bold text-[#8E8E93] gap-1 bg-[#0C0C0E] px-2 py-1 rounded-[8px] border border-[#222226]">
            <Navigation size={10} className="text-[#8E8E93]" />
            {event.distanceInKm < 1 ? `${Math.round(event.distanceInKm * 1000)}m` : `${event.distanceInKm.toFixed(1)}km`}
          </div>
        </div>

        {/* ── TITOLO E LUOGO ──────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col justify-start">
          <h3 className="font-black text-white text-[19px] leading-tight line-clamp-2 mb-1 tracking-tight">
            {event.title}
          </h3>
          <p className="text-[12px] text-[#8E8E93] font-normal truncate flex items-center gap-1 mb-1.5">
            📍 {event.gym.name}
          </p>
          {event.description && (
            <p className="text-[11px] text-[#8E8E93]/80 font-normal line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* ── DATA E ORA ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-4 relative z-10">
          <div className="bg-[#0C0C0E] border border-[#222226] text-white rounded-[12px] flex flex-col items-center justify-center w-[52px] h-[52px] shrink-0 relative overflow-hidden">
            <span className="text-[10px] font-normal text-[#8E8E93] uppercase leading-none mt-1">{formattedDate.split(' ')[1]}</span>
            <span className="text-[18px] font-black leading-none tracking-tighter">{formattedDate.split(' ')[0]}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-black text-white leading-none">{formattedTime}</span>
            <span className="text-[11px] text-[#8E8E93] font-normal mt-1">Inizio Partita</span>
          </div>
        </div>

        {/* ── MINI BADGES ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[8px] bg-[#222226] text-white">
            <Banknote size={10} />
            {event.price ? `€ ${event.price.toFixed(2)}` : 'Gratis'}
          </div>
          {event.skillLevel && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[8px] bg-[#222226] text-[#8E8E93]">
              <Trophy size={10} />
              {event.skillLevel}
            </div>
          )}
          {event.genderPreference && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[8px] bg-[#222226] text-[#8E8E93]">
              <Users size={10} />
              {event.genderPreference}
            </div>
          )}
        </div>

        {/* ── FOOTER (Progress Bar) ───────────────── */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#222226] relative z-10 mt-auto">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-normal text-[#8E8E93] mb-1.5">
              <span><strong className="text-white font-bold">{currentParticipants}/{maxPlayers}</strong> Iscritti</span>
              <span className={fillPct >= 100 ? 'text-red-500 font-bold' : 'text-[#8E8E93]'}>{fillPct >= 100 ? 'Completo' : `${maxPlayers - currentParticipants} liberi`}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#222226] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${fillPct >= 100 ? 'bg-red-500' : 'bg-[#CCFF00]'}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-[12px] text-black text-[11px] font-black shadow-sm bg-[#CCFF00]">
            {event.creator.name[0]}
          </div>
        </div>

      </div>
    </Link>
  );
}
