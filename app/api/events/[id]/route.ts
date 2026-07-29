import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations/event";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    if (event.creatorId !== userId) {
      return NextResponse.json({ error: "Azione non consentita" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = createEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Dati non validi", details: parseResult.error.format() }, { status: 400 });
    }

    const data = parseResult.data;

    let latitude = data.latitude || event.latitude;
    let longitude = data.longitude || event.longitude;
    let locationStr = data.location || event.location;

    if (data.gymId) {
      const gym = await prisma.gym.findUnique({ where: { id: data.gymId } });
      if (gym) {
        latitude = gym.latitude;
        longitude = gym.longitude;
        locationStr = gym.address;
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || "",
        sport: data.sport,
        dateStart: new Date(data.dateStart),
        location: locationStr,
        latitude,
        longitude,
        maxPlayers: data.maxPlayers,
        isPrivate: data.isPrivate,
        price: data.price || null,
        skillLevel: data.skillLevel || null,
        genderPreference: data.genderPreference || null,
        gymId: data.gymId || null,
        circleId: data.isPrivate ? data.circleId : null,
      }
    });

    return NextResponse.json({ message: "Evento aggiornato", event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error("Errore aggiornamento evento:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
    }

    if (event.creatorId !== userId) {
      return NextResponse.json({ error: "Azione non consentita" }, { status: 403 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: "Evento eliminato" }, { status: 200 });
  } catch (error) {
    console.error("Errore eliminazione evento:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
