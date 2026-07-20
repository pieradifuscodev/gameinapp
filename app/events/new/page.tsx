import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EventForm from "./EventForm";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Fetch cerchie dell'utente (proprietario o membro)
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

  // Fetch strutture sportive disponibili (se vogliamo pre-selezionarne una per l'organizzatore potremmo filtrarle)
  // Al momento le carichiamo tutte
  const gyms = await prisma.gym.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      latitude: true,
      longitude: true
    }
  });

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <EventForm userRole={role} circles={circles} gyms={gyms} />
    </div>
  );
}
