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
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

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

    // 2. Filtro condizionale per sport, data e ora
    const sportFilter = sportParam && sportParam !== 'null'
      ? Prisma.sql`AND e.sport = ${sportParam}` 
      : Prisma.empty;
      
    let startDate = new Date();
    let endDate: Date | null = null;
    
    if (dateParam === 'TODAY') {
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (dateParam === 'TOMORROW') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (dateParam === 'WEEK') {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
    }
    
    const dateFilter = endDate 
      ? Prisma.sql`AND e."dateStart" >= ${startDate} AND e."dateStart" <= ${endDate}`
      : Prisma.sql`AND e."dateStart" >= ${startDate}`;

    let timeFilter = Prisma.empty;
    if (timeParam === 'MORNING') {
      timeFilter = Prisma.sql`AND EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') >= 6 AND EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') < 13`;
    } else if (timeParam === 'AFTERNOON') {
      timeFilter = Prisma.sql`AND EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') >= 13 AND EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') < 19`;
    } else if (timeParam === 'EVENING') {
      timeFilter = Prisma.sql`AND (EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') >= 19 OR EXTRACT(HOUR FROM e."dateStart" AT TIME ZONE 'Europe/Rome') < 6)`;
    }

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
          ${dateFilter}
          ${timeFilter}
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
        d.price,
        d."skillLevel",
        d."genderPreference",
        d."distanceInKm",
        json_build_object('id', COALESCE(g.id, ''), 'name', COALESCE(g.name, d.location), 'address', COALESCE(g.address, d.location)) AS gym,
        json_build_object('id', u.id, 'name', u.name, 'surname', u.surname, 'email', u.email, 'role', u.role) AS creator
      FROM calculated_distances d
      LEFT JOIN "Gym" g ON d."gymId" = g.id
      JOIN "User" u ON d."creatorId" = u.id
      WHERE d."distanceInKm" <= ${radius}
      ORDER BY d."distanceInKm" ASC;
    `;

    // 4. Fetch distinct Gyms nearby (for the popular gyms section)
    const gyms = await prisma.$queryRaw`
      SELECT 
        id, name, address, latitude, longitude,
        (2 * 6371 * asin(sqrt(
          power(sin(radians(latitude - ${lat}) / 2), 2) +
          cos(radians(${lat})) * cos(radians(latitude)) *
          power(sin(radians(longitude - ${lng}) / 2), 2)
        ))) AS "distanceInKm"
      FROM "Gym"
      WHERE (2 * 6371 * asin(sqrt(
          power(sin(radians(latitude - ${lat}) / 2), 2) +
          cos(radians(${lat})) * cos(radians(latitude)) *
          power(sin(radians(longitude - ${lng}) / 2), 2)
        ))) <= ${radius}
      ORDER BY "distanceInKm" ASC
      LIMIT 10;
    `;

    // 5. Struttura della Risposta HTTP
    return NextResponse.json({ events, gyms }, { status: 200 });
  } catch (error) {
    console.error('Errore durante la ricerca geolocalizzata degli eventi:', error);
    return NextResponse.json(
      { error: 'Errore interno del server durante il calcolo geospaziale.' },
      { status: 500 }
    );
  }
}
