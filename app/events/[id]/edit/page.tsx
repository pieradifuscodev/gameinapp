import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EventForm from "@/components/events/forms/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) {
    return notFound();
  }

  if (event.creatorId !== userId) {
    redirect(`/events/${id}`);
  }

  // Fetch cerchie dell'utente
  const circles = await prisma.circle.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { id: userId } } }
      ]
    },
    select: {
      id: true,
      name: true
    }
  });

  // Fetch strutture sportive
  const gyms = await prisma.gym.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      latitude: true,
      longitude: true
    }
  });

  // Pre-fill
  const initialData = {
    title: event.title,
    sport: event.sport,
    dateStart: new Date(event.dateStart.getTime() - event.dateStart.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    description: event.description || "",
    isPrivate: event.isPrivate,
    circleId: event.circleId || "",
    gymId: event.gymId || "",
    location: event.location,
    latitude: event.latitude,
    longitude: event.longitude,
    maxPlayers: event.maxPlayers,
    price: event.price || null,
    skillLevel: event.skillLevel || "",
    genderPreference: event.genderPreference || ""
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <EventForm 
        userRole={role} 
        circles={circles} 
        gyms={gyms} 
        eventId={id}
        initialData={initialData}
      />
    </div>
  );
}
