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
          <div className="w-20 h-20 shrink-0 rounded-[12px] overflow-hidden border border-[#222226] relative">
            <img src={imageUrl} alt={sportLabel || "Sport"} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}
        
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between items-end mb-1">
            <Badge variant={status === 'OPEN' ? 'default' : 'secondary'} className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border shadow-none ${
              status === 'OPEN' ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/50' : 'bg-[#16161A] text-[#8E8E93] border-[#222226]'
            }`}>
              {status}
            </Badge>
          </div>
          
          <h1 className="text-xl font-black text-white leading-tight mb-2 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-[8px] border ${
          price ? 'bg-[#16161A] text-white border-[#222226]' : 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/50'
        }`}>
          <Banknote size={12} />
          {price ? `€ ${price.toFixed(2)}` : 'Gratis'}
        </Badge>

        {skillLevel && (
          <Badge variant="outline" className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-[8px] bg-orange-500/20 text-orange-400 border-orange-500/50">
            <Trophy size={12} />
            {skillLevel}
          </Badge>
        )}

        {genderPreference && (
          <Badge variant="outline" className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-[8px] bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Users size={12} />
            {genderPreference}
          </Badge>
        )}
      </div>
    </div>
  );
}
