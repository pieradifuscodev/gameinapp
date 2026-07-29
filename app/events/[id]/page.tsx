import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSportDetails } from "@/lib/sports";
import EventClientActions from "@/components/events/EventClientActions";
import { EventHero } from "@/components/events/details/EventHero";
import { EventBadges } from "@/components/events/details/EventBadges";
import { EventInfoCards } from "@/components/events/details/EventInfoCards";
import { EventOrganizer } from "@/components/events/details/EventOrganizer";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user ? (session.user as any).id : null;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      gym: true,
      creator: true,
      participants: true,
    },
  });

  if (!event) {
    return notFound();
  }

  const isCreator = currentUserId === event.creatorId;
  const isParticipating = event.participants.some(p => p.id === currentUserId);
  const spotsLeft = event.maxPlayers - event.participants.length;
  const isFull = spotsLeft <= 0;
  const sport = getSportDetails(event.sport);

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      
      {/* ── TOP HEADER ── */}
      <EventHero imageUrl={`/images/sports/${sport.imageId}.png`} sportLabel={sport.label} />

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto pb-24 pt-4">
        {/* ── TITLE & BADGES ── */}
        <EventBadges 
          status={event.status} 
          title={event.title} 
          price={event.price} 
          skillLevel={event.skillLevel} 
          genderPreference={event.genderPreference} 
          imageUrl={`/images/sports/${sport.imageId}.png`}
          sportLabel={sport.label}
        />

      {/* ── DESCRIZIONE ── */}
      {event.description && (
        <div className="px-5 mb-5">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descrizione</h3>
          <p className="text-slate-900 text-[14px] leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* ── INFO CARDS ── */}
      <EventInfoCards 
        dateStart={event.dateStart}
        gymName={event.gym?.name || null}
        location={event.location}
        gymAddress={event.gym?.address || null}
        participantsCount={event.participants.length}
        maxPlayers={event.maxPlayers}
        spotsLeft={spotsLeft}
        isFull={isFull}
      />

      {/* ── STRUTTURA ── */}
      <EventOrganizer 
        id={event.creator.id}
        name={event.creator.name}
        surname={event.creator.surname}
        role={event.creator.role}
      />

      {/* ── CLIENT ACTIONS (Pagamento/Iscrizione/Modifica) ── */}
      <EventClientActions 
        eventId={event.id}
        price={event.price}
        spotsLeft={spotsLeft}
        isFull={isFull}
        isCreator={isCreator}
        isParticipating={isParticipating}
      />
      </div>
    </div>
  );
}
