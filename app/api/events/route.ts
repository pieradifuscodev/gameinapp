import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations/event";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const body = await req.json();

    const parseResult = createEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Dati non validi", details: parseResult.error.format() }, { status: 400 });
    }

    const data = parseResult.data;

    let latitude = data.latitude || 0;
    let longitude = data.longitude || 0;
    let locationStr = data.location || "";

    if (data.gymId) {
      const gym = await prisma.gym.findUnique({ where: { id: data.gymId } });
      if (gym) {
        latitude = gym.latitude;
        longitude = gym.longitude;
        locationStr = gym.address;
      } else {
        return NextResponse.json({ error: "Struttura non trovata" }, { status: 404 });
      }
    } else if (!latitude || !longitude) {
      // Fallback
      latitude = (session.user as any).latitude || 40.8518;
      longitude = (session.user as any).longitude || 14.2681;
    }

    // Creazione evento
    const newEvent = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || "",
        sport: data.sport,
        dateStart: new Date(data.dateStart),
        location: locationStr,
        latitude,
        longitude,
        maxPlayers: data.maxPlayers,
        status: "OPEN",
        isPrivate: data.isPrivate,
        creatorId: userId,
        gymId: data.gymId || null,
        circleId: data.isPrivate ? data.circleId : null,
        // Se è sportivo, aggiungilo subito ai partecipanti
        participants: userRole === "SPORTIVO" ? {
          connect: [{ id: userId }]
        } : undefined
      }
    });

    return NextResponse.json({ message: "Evento creato con successo", event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Errore creazione evento:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
