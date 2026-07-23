import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSportDetails } from "@/lib/sports";
import { CompactEventCard } from "@/components/events/CompactEventCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Verify sport exists
  let sport;
  try {
    sport = getSportDetails(id);
  } catch (e) {
    return notFound();
  }

  // Fetch events for this sport
  const events = await prisma.event.findMany({
    where: { sport: id },
    include: {
      gym: true,
      participants: true,
    },
    orderBy: { dateStart: 'asc' },
  });

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      
      {/* ── TOP HEADER ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-50 pt-[max(env(safe-area-inset-top),12px)]">
        <Link href="/categories" className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate-900">{sport.label}</span>
          {sport.icon && <span className="text-lg">{sport.icon}</span>}
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* ── LIST ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-safe">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4 opacity-50 ${sport.color}`}>
              {sport.icon}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Nessun evento</h2>
            <p className="text-slate-500 text-[14px]">
              Al momento non ci sono partite in programma per {sport.label}.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
              {events.length} {events.length === 1 ? 'partita trovata' : 'partite trovate'}
            </p>
            {events.map(event => (
              <CompactEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
