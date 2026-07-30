import { Trophy, ChevronRight, Zap } from "lucide-react";
import { getSportIconUrl } from "@/lib/sports";

const AD_TOURNAMENTS = [
  {
    id: "t1",
    title: "Champions Calcetto Cup",
    subtitle: "Premio 500€",
    sport: { id: "CALCETTO", label: "Calcetto" },
    organizer: "Milano Sport",
  },
  {
    id: "t2",
    title: "Padel Summer Open",
    subtitle: "In palio racchette PRO",
    sport: { id: "PADEL", label: "Padel" },
    organizer: "Roma Padel Club",
  },
];

export default function TournamentAdCards() {
  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-4 px-6">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-[#CCFF00]" />
          <h2 className="font-black text-white text-lg tracking-tight">Tornei in Evidenza</h2>
        </div>
        <button className="text-xs font-bold text-[#8E8E93] hover:text-white transition-colors flex items-center gap-0.5">
          Vedi tutti <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-6 snap-x px-6 scroll-px-6">
        {AD_TOURNAMENTS.map((t) => (
          <div
            key={t.id}
            className={`snap-start shrink-0 w-[300px] h-auto min-h-[170px] rounded-[12px] bg-[#16161A] border border-[#222226] shadow-sm hover:border-[#CCFF00]/50 relative overflow-hidden group cursor-pointer transition-colors`}
          >
            {/* Animated shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CCFF00]/5 to-transparent -translate-x-[150%] animate-[shimmer_2.5s_infinite] skew-x-[-20deg]" />
            
            {/* Inner Content */}
            <div className="w-full h-full p-5 flex flex-col justify-between relative z-10 overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className={`inline-flex items-center gap-1 bg-[#CCFF00]/10 text-[#CCFF00] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[8px] mb-3`}>
                    <Zap size={10} className="fill-[#CCFF00]" /> Sponsorizzato
                  </div>
                  <h3 className="text-white font-black text-xl leading-tight tracking-tight">
                    {t.title}
                  </h3>
                  <p className="text-[#8E8E93] text-xs font-normal mt-1">
                    {t.subtitle}
                  </p>
                </div>
                
                <div className="w-12 h-12 bg-[#0C0C0E] border border-[#222226] rounded-[12px] flex items-center justify-center text-2xl transform group-active:scale-90 transition-transform shrink-0 ml-3">
                  <img src={getSportIconUrl(t.sport.id)} alt={t.sport.label} className="w-6 h-6 object-contain" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[8px] bg-[#222226] flex items-center justify-center text-[10px] font-black text-white">
                    {t.organizer[0]}
                  </div>
                  <span className="text-white text-xs font-bold">
                    {t.organizer}
                  </span>
                </div>
                <button className="bg-[#CCFF00] text-black text-[11px] font-black px-4 py-2.5 rounded-[24px] active:bg-[#a6d100] transition-colors group-active:scale-95">
                  Iscriviti
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="shrink-0 w-5" aria-hidden />
      </div>
    </section>
  );
}
