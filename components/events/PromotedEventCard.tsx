import Link from "next/link";
import { Star, Navigation } from "lucide-react";
import { getSportDetails, getSportIconUrl } from "@/lib/sports";

interface PromotedEventCardProps {
  event: any; 
  isBanner?: boolean;
}

export default function PromotedEventCard({ event, isBanner = false }: PromotedEventCardProps) {
  const sport = getSportDetails(event.sport);

  return (
    <Link href={`/events/${event.id}`} className={`block group shrink-0 ${isBanner ? 'w-[300px]' : 'w-[260px]'} snap-start`}>
      {/* Neon border effect using background */}
      <div className="bg-[#CCFF00] rounded-[12px] p-[1px] shadow-[0_4px_20px_rgb(204,255,0,0.15)] hover:shadow-[0_4px_20px_rgb(204,255,0,0.3)] transition-all active:scale-[0.98] h-full flex flex-col">
        <div className="bg-[#16161A] rounded-[11px] p-5 flex flex-col relative overflow-hidden flex-1">
          
          <div className="absolute top-0 right-0 bg-[#CCFF00] text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl-[8px] z-20 flex items-center gap-1">
            <Star size={10} className="fill-black" /> Sponsorizzato
          </div>

          <div className="flex justify-between items-start mb-4 mt-2 relative z-10">
            <span className={`text-[10px] font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-2.5 py-1 rounded-[8px] flex items-center gap-1 shadow-sm`}>
              <span className="text-sm leading-none flex items-center"><img src={getSportIconUrl(sport.id)} alt={sport.label} className="w-3.5 h-3.5 object-contain" /></span> {sport.label}
            </span>
            <span className="flex items-center text-[10px] font-bold text-[#8E8E93] gap-1 bg-[#0C0C0E] px-2 py-1 rounded-[8px] shadow-sm border border-[#222226]">
              <Navigation size={10} className="text-[#8E8E93]" />
              {event.distanceInKm < 1 ? `${Math.round(event.distanceInKm * 1000)}m` : `${event.distanceInKm.toFixed(1)}km`}
            </span>
          </div>

          <h3 className={`font-black text-white ${isBanner ? 'text-[19px]' : 'text-[17px]'} mb-1 leading-tight relative z-10 line-clamp-2 flex-1 tracking-tight`}>
            {event.title}
          </h3>

          <div className="mt-3 relative z-10">
            <p className="text-[12px] text-[#8E8E93] font-normal flex items-center gap-1 truncate mb-4">
              📍 <span className="truncate">{event.gym.name}</span>
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#222226]">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-[8px] bg-[#222226] text-white flex items-center justify-center text-[11px] font-black`}>
                  {event.creator.name[0]}
                </div>
                <span className="text-[11px] text-white font-bold truncate max-w-[100px]">
                  {event.creator.name} {event.creator.surname}
                </span>
              </div>
              <div className="text-[10px] font-bold text-[#8E8E93] bg-[#0C0C0E] px-2.5 py-1.5 rounded-[8px] border border-[#222226]">
                {new Date(event.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
