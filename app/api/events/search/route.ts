import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const sportParam = searchParams.get('sport');

    // 1. Estrazione e Validazione
    if (!latParam || !lngParam) {
      return NextResponse.json(
        { error: 'I parametri lat e lng sono obbligatori per la ricerca geolocalizzata.' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    const radius = radiusParam ? parseFloat(radiusParam) : 20;

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      return NextResponse.json(
        { error: 'I parametri lat, lng e radius devono essere valori numerici validi.' },
        { status: 400 }
      );
    }

    // 2. Filtro condizionale per sport
    const sportFilter = sportParam 
      ? Prisma.sql`AND e.sport = ${sportParam}` 
      : Prisma.empty;

    // 3. Calcolo Geospaziale con Haversine e filtri aggiuntivi tramite $queryRaw
    // Usiamo una CTE (Common Table Expression) per calcolare la distanza e poi filtrare su di essa
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
          AND e."isPrivate" = false
          ${sportFilter}
      )
      SELECT 
        d.id,
        d.title,
        d.description,
        d.sport,
        d."dateStart",
        d.location,
        d.latitude,
        d.longitude,
        d."maxPlayers",
        d.status,
        d."isPrivate",
        d."distanceInKm",
        json_build_object('id', g.id, 'name', g.name, 'address', g.address) AS gym,
        json_build_object('id', u.id, 'name', u.name, 'surname', u.surname, 'email', u.email) AS creator
      FROM calculated_distances d
      JOIN "Gym" g ON d."gymId" = g.id
      JOIN "User" u ON d."creatorId" = u.id
      WHERE d."distanceInKm" <= ${radius}
      ORDER BY d."distanceInKm" ASC;
    `;

    // 4. Struttura della Risposta HTTP
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Errore durante la ricerca geolocalizzata degli eventi:', error);
    return NextResponse.json(
      { error: 'Errore interno del server durante il calcolo geospaziale.' },
      { status: 500 }
    );
  }
}
