import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = (session.user as any).id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    if (event.participants.length >= event.maxPlayers) {
      return NextResponse.json({ error: "Evento al completo" }, { status: 400 });
    }

    if (event.participants.some((p: any) => p.id === userId)) {
      return NextResponse.json({ error: "Sei già iscritto" }, { status: 400 });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          connect: { id: userId }
        }
      }
    });

    if (event.creatorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: event.creatorId,
          type: "EVENT_JOIN",
          title: "Nuovo Partecipante",
          message: `Qualcuno si è appena iscritto al tuo evento "${event.title}".`,
          link: `/events/${eventId}`,
        }
      });
    }

    return NextResponse.json({ message: "Iscrizione confermata" }, { status: 200 });
  } catch (error) {
    console.error("Errore iscrizione evento:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = (session.user as any).id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    if (!event.participants.some(p => p.id === userId)) {
      return NextResponse.json({ error: "Non sei iscritto" }, { status: 400 });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          disconnect: { id: userId }
        }
      }
    });

    if (event.creatorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: event.creatorId,
          type: "EVENT_LEAVE",
          title: "Partecipazione Annullata",
          message: `Qualcuno ha annullato l'iscrizione al tuo evento "${event.title}".`,
          link: `/events/${eventId}`,
        }
      });
    }

    return NextResponse.json({ message: "Partecipazione annullata" }, { status: 200 });
  } catch (error) {
    console.error("Errore annullamento partecipazione:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
