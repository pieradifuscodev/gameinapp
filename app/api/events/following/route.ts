import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

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

    const followingIds = userWithFollowing.following.map((f: any) => f.id);

    if (followingIds.length === 0) {
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    const now = new Date();

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      
      const inClause = Prisma.join(followingIds);
      
      const events = await prisma.$queryRaw`
        WITH calculated_distances AS (
          SELECT 
            e.*,
            (2 * 6371 * asin(sqrt(
              power(sin(radians(e.latitude - ${lat}) / 2), 2) +
              cos(radians(${lat})) * cos(radians(e.latitude)) *
              power(sin(radians(e.longitude - ${lng}) / 2), 2)
            ))) AS "distanceInKm"
          FROM "Event" e
          WHERE e.status = 'OPEN' 
            AND e."dateStart" >= ${now}
            AND e."creatorId" IN (${inClause})
        )
        SELECT 
          d.id, d.title, d.description, d.sport, d."dateStart", d.location, 
          d.latitude, d.longitude, d."maxPlayers", d.status, d."isPrivate",
          d.price, d."skillLevel", d."genderPreference", d."distanceInKm",
          json_build_object('id', COALESCE(g.id, ''), 'name', COALESCE(g.name, d.location), 'address', COALESCE(g.address, d.location)) AS gym,
          json_build_object('id', u.id, 'name', u.name, 'surname', u.surname, 'email', u.email, 'role', u.role) AS creator,
          (SELECT count(*) FROM "_EventParticipants" ep WHERE ep."A" = d.id) AS "participantsCount"
        FROM calculated_distances d
        LEFT JOIN "Gym" g ON d."gymId" = g.id
        JOIN "User" u ON d."creatorId" = u.id
        ORDER BY d."dateStart" ASC;
      `;
      
      return NextResponse.json({ events }, { status: 200 });
    } else {
      // Fallback se non c'è geolocalizzazione
      const events = await prisma.event.findMany({
        where: {
          creatorId: { in: followingIds },
          status: "OPEN",
          dateStart: { gte: now }
        },
        include: {
          gym: { select: { id: true, name: true, address: true } },
          creator: { select: { id: true, name: true, surname: true, email: true, role: true } },
          participants: { select: { id: true } }
        },
        orderBy: { dateStart: "asc" }
      });
      return NextResponse.json({ events }, { status: 200 });
    }

  } catch (error) {
    console.error("Errore recupero eventi seguiti:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
