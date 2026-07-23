import { Banknote, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventBadgesProps {
  status: string;
  title: string;
  price: number | null;
  skillLevel: string | null;
  genderPreference: string | null;
  imageUrl?: string;
  sportLabel?: string;
}

export function EventBadges({ status, title, price, skillLevel, genderPreference, imageUrl, sportLabel }: EventBadgesProps) {
  return (
    <div className="px-4 mt-4 relative z-10 mb-4">
      <div className="flex gap-4">
        {imageUrl && (
          <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-slate-100 relative">
            <img src={imageUrl} alt={sportLabel || "Sport"} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}
        
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between items-end mb-1">
            <Badge variant={status === 'OPEN' ? 'default' : 'secondary'} className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shadow-none ${
              status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {status}
            </Badge>
          </div>
          
          <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
          price ? 'bg-white text-slate-800 border-slate-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          <Banknote size={12} />
          {price ? `€ ${price.toFixed(2)}` : 'Gratis'}
        </Badge>

        {skillLevel && (
          <Badge variant="outline" className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border-orange-200">
            <Trophy size={12} />
            {skillLevel}
          </Badge>
        )}

        {genderPreference && (
          <Badge variant="outline" className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border-blue-200">
            <Users size={12} />
            {genderPreference}
          </Badge>
        )}
      </div>
    </div>
  );
}
