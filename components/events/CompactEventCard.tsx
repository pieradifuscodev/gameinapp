import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { getSportDetails } from "@/lib/sports";

interface CompactEventCardProps {
  event: any;
}

export function CompactEventCard({ event }: CompactEventCardProps) {
  const sport = getSportDetails(event.sport);
  const spotsLeft = event.maxPlayers - (event.participants?.length || 0);
  const isFull = spotsLeft <= 0;
  
  const dateObj = new Date(event.dateStart);
  const day = dateObj.toLocaleDateString("it-IT", { day: "numeric" });
  const month = dateObj.toLocaleDateString("it-IT", { month: "short" });
  const time = dateObj.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  return (
    <Link href={`/events/${event.id}`} className="block active:scale-[0.98] transition-transform">
      <div className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm mb-3">
        {/* Left: Date/Sport Thumbnail */}
        <div className={`w-16 h-20 shrink-0 rounded-xl flex flex-col items-center justify-center text-white shadow-sm ${sport.color}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{month}</span>
          <span className="text-2xl font-black leading-none my-0.5">{day}</span>
          <span className="text-[11px] font-bold opacity-90">{time}</span>
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
              event.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {event.status}
            </span>
            <span className="text-[11px] font-bold text-slate-900">
              {event.price ? `€ ${event.price.toFixed(2)}` : 'Gratis'}
            </span>
          </div>
          
          <h3 className="font-bold text-slate-900 text-[15px] leading-tight mb-1.5 truncate">
            {event.title}
          </h3>
          
          <div className="flex items-center text-[12px] text-slate-500 gap-3">
            <span className="flex items-center gap-1 truncate">
              <MapPin size={12} /> {event.gym?.name || event.location || "Da definire"}
            </span>
            <span className={`flex items-center gap-1 shrink-0 font-bold ${isFull ? 'text-red-500' : 'text-slate-500'}`}>
              <Users size={12} /> {isFull ? 'Completo' : `${spotsLeft} posti`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
