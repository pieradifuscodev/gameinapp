import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSportDetails } from "@/lib/sports";
import { CompactEventCard } from "@/components/events/CompactEventCard";
import { notFound } from "next/navigation";
import { SportIcon } from "@/components/ui/SportIcon";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="flex flex-col h-full bg-[#0C0C0E]">
      
      {/* ── LIST ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-safe">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-[#CCFF00] mb-4 opacity-50 bg-[#16161A]`}>
              <SportIcon sportId={sport.id} size={40} />
            </div>
            <h2 className="text-lg font-black text-white mb-2">Nessun evento</h2>
            <p className="text-[#8E8E93] text-[14px]">
              Al momento non ci sono partite in programma per {sport.label}.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4 px-1">
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
