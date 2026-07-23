import { Trophy, Users, ChevronRight } from "lucide-react";

const PLACEHOLDER_TOURNAMENTS = [
  {
    id: "t1",
    title: "Torneo Estivo di Calcetto",
    sport: { icon: "⚽️", label: "Calcetto" },
    organizer: "ASD Sport Club Milano",
    date: "15 Ago 2025",
    prize: "500€",
    slots: 16,
    slotsLeft: 4,
    gradient: "from-[#1f4a23] to-[#0d9488]",
    accentColor: "#4ade80",
  },
  {
    id: "t2",
    title: "Champions Padel Cup",
    sport: { icon: "🏸", label: "Padel" },
    organizer: "Padel Arena Roma",
    date: "22 Ago 2025",
    prize: "300€",
    slots: 32,
    slotsLeft: 12,
    gradient: "from-[#0284c7] to-[#6d28d9]",
    accentColor: "#7dd3fc",
  },
  {
    id: "t3",
    title: "Open Basket 3vs3",
    sport: { icon: "🏀", label: "Basket" },
    organizer: "Palasport Napoli",
    date: "5 Set 2025",
    prize: "200€",
    slots: 24,
    slotsLeft: 8,
    gradient: "from-[#bf591f] to-[#d97706]",
    accentColor: "#fb923c",
  },
];

export default function TournamentAdCards() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-6">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" />
          <h2 className="font-black text-gray-900 text-lg">Tornei in Evidenza</h2>
        </div>
        <button className="text-xs font-bold text-primary flex items-center gap-0.5">
          Vedi tutti <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-3 snap-x px-6 scroll-px-6">
        {PLACEHOLDER_TOURNAMENTS.map((t) => {
          const fillPct = Math.round(((t.slots - t.slotsLeft) / t.slots) * 100);
          return (
            <div
              key={t.id}
              className="snap-start shrink-0 w-72 rounded-2xl bg-white border border-slate-200 p-4 relative overflow-hidden flex flex-col gap-3 active:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-amber-200">
                In Arrivo
              </div>
              
              <div className="relative z-10 flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shrink-0">
                  {t.sport.icon}
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t.sport.label}</p>
                  <h3 className="text-slate-900 font-bold text-[16px] leading-tight pr-10 line-clamp-2">{t.title}</h3>
                </div>
              </div>
              
              <p className="text-slate-600 text-xs font-medium relative z-10 truncate mt-1">
                📍 {t.organizer}
              </p>
              
              <div className="flex items-center gap-2 relative z-10">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                  <Trophy size={12} className="text-amber-500" />
                  <span className="text-slate-900 font-bold text-sm">{t.prize}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                  <Users size={12} className="text-slate-500" />
                  <span className="text-slate-700 font-bold text-sm">{t.slotsLeft} posti</span>
                </div>
              </div>
              
              <div className="relative z-10 mt-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1.5">
                  <span>{t.slots - t.slotsLeft}/{t.slots} iscritti</span>
                  <span>{t.date}</span>
                </div>
                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${fillPct}%` }} />
                </div>
              </div>
              
              <button className="relative z-10 mt-2 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm py-2 rounded-xl transition-colors">
                Iscriviti al torneo
              </button>
            </div>
          );
        })}
        <div className="shrink-0 w-5" aria-hidden />
      </div>
    </section>
  );
}
