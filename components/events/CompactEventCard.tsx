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
      <div className="flex gap-4 p-4 bg-[#16161A] border border-[#222226] hover:border-[#CCFF00]/50 rounded-2xl shadow-sm mb-3 transition-colors">
        {/* Left: Date/Sport Thumbnail */}
        <div className="w-16 h-20 shrink-0 rounded-xl flex flex-col items-center justify-center bg-[#0C0C0E] border border-[#222226] text-white shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">{month}</span>
          <span className="text-2xl font-black leading-none my-0.5 text-white">{day}</span>
          <span className="text-[11px] font-bold text-[#CCFF00]">{time}</span>
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
              event.status === 'OPEN' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-[#0C0C0E] text-[#8E8E93] border-[#222226]'
            }`}>
              {event.status}
            </span>
            <span className="text-[11px] font-black text-white">
              {event.price ? `€ ${event.price.toFixed(2)}` : 'Gratis'}
            </span>
          </div>
          
          <h3 className="font-black text-white text-[15px] leading-tight mb-1.5 truncate">
            {event.title}
          </h3>
          
          <div className="flex items-center text-[12px] text-[#8E8E93] gap-3">
            <span className="flex items-center gap-1 truncate">
              <MapPin size={12} className="text-[#8E8E93]" /> {event.gym?.name || event.location || "Da definire"}
            </span>
            <span className={`flex items-center gap-1 shrink-0 font-bold ${isFull ? 'text-red-500' : 'text-[#8E8E93]'}`}>
              <Users size={12} className="text-[#8E8E93]" /> {isFull ? 'Completo' : `${spotsLeft} posti`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
