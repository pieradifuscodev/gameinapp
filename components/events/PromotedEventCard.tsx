import Link from "next/link";
import { Star, MapPin, Navigation } from "lucide-react";
import { getSportDetails } from "@/lib/sports";

interface PromotedEventCardProps {
  event: any; // Type as needed based on your EventData
  isBanner?: boolean;
}

export default function PromotedEventCard({ event, isBanner = false }: PromotedEventCardProps) {
  const sport = getSportDetails(event.sport);

  return (
    <Link href={`/events/${event.id}`} className={`block group shrink-0 ${isBanner ? 'w-80' : 'w-64'} snap-start`}>
      <div className="bg-white rounded-2xl p-4 border border-slate-200 active:bg-slate-50 transition-colors relative overflow-hidden h-full flex flex-col">
        {isBanner && (
          <div className="absolute top-0 right-0 bg-amber-100 text-amber-900 text-[9px] font-bold uppercase px-2 py-1 rounded-bl-xl z-20 flex items-center gap-1 border-b border-l border-amber-200">
            <Star size={10} className="fill-current" /> Promosso
          </div>
        )}

        <div className="flex justify-between items-start mb-3 relative z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${sport.pillText} ${sport.pillColor} px-2 py-1 rounded-lg flex items-center gap-1`}>
            <span className="text-sm">{sport.icon}</span> {sport.label}
          </span>
          <span className="flex items-center text-[10px] font-bold text-slate-600 gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            <Navigation size={10} className="text-slate-400" />
            {event.distanceInKm < 1 ? `${Math.round(event.distanceInKm * 1000)}m` : `${event.distanceInKm.toFixed(1)}km`}
          </span>
        </div>

        <h3 className={`font-bold text-slate-900 ${isBanner ? 'text-[17px]' : 'text-[15px]'} mb-1 leading-tight relative z-10 line-clamp-2 flex-1`}>
          {event.title}
        </h3>

        <div className="mt-3 relative z-10">
          <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1 truncate mb-3">
            📍 <span className="truncate">{event.gym.name}</span>
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold border border-slate-200`}>
                {event.creator.name[0]}
              </div>
              <span className="text-[10px] text-slate-600 font-bold truncate max-w-[100px]">
                {event.creator.name} {event.creator.surname}
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              {new Date(event.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
