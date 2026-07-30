import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSportDetails } from "@/lib/sports";
import EventClientActions from "@/components/events/EventClientActions";
import { EventBadges } from "@/components/events/details/EventBadges";
import { EventInfoCards } from "@/components/events/details/EventInfoCards";
import { EventOrganizer } from "@/components/events/details/EventOrganizer";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MapClientWrapper from "@/components/ui/MapClientWrapper";

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
  const mockupImage = `/images/sports/${sport.imageId}_mockup.png`;

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E]">
      
      {/* ── SCROLLABLE CONTENT ── */}
      <div className="flex-1 overflow-y-auto pb-24 pt-4">
        {/* ── TITLE & BADGES ── */}
        <EventBadges 
          status={event.status} 
          title={event.title} 
          price={event.price} 
          skillLevel={event.skillLevel} 
          genderPreference={event.genderPreference} 
          imageUrl={mockupImage}
          sportLabel={sport.label}
        />

      {/* ── DESCRIZIONE ── */}
      {event.description && (
        <div className="px-5 mb-5">
          <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">Descrizione</h3>
          <p className="text-white text-[14px] leading-relaxed">{event.description}</p>
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

      {/* ── MAPPA POSIZIONE EVENTO ── */}
      {event.latitude && event.longitude && (
        <div className="px-5 mb-6">
          <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">Posizione Campo</h3>
          <div className="h-40 w-full rounded-xl overflow-hidden border border-[#222226] relative bg-[#0C0C0E] z-0">
            <MapClientWrapper 
              events={[event]} 
              center={{ lat: event.latitude, lng: event.longitude }} 
              radius={1} 
            />
          </div>
        </div>
      )}

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
