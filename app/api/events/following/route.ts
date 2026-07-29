import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;

    // Recupera l'elenco degli utenti seguiti
    const userWithFollowing = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        following: {
          select: { id: true }
        }
      }
    });

    if (!userWithFollowing) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    const followingIds = userWithFollowing.following.map(f => f.id);

    if (followingIds.length === 0) {
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    // Recupera gli eventi futuri creati dagli utenti seguiti
    const now = new Date();
    const events = await prisma.event.findMany({
      where: {
        creatorId: { in: followingIds },
        status: "OPEN",
        dateStart: { gte: now } // Solo eventi attivi
      },
      include: {
        gym: {
          select: { id: true, name: true, address: true }
        },
        creator: {
          select: { id: true, name: true, surname: true, email: true, role: true }
        },
        participants: {
          select: { id: true }
        }
      },
      orderBy: {
        dateStart: "asc"
      }
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Errore recupero eventi seguiti:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
