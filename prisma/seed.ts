import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Inizio popolamento del database (Seeding)...');

    // Clean-up iniziale (opzionale, utile in fase di sviluppo)
    await prisma.event.deleteMany();
    await prisma.circle.deleteMany();
    await prisma.gym.deleteMany();
    await prisma.user.deleteMany();

    // 1. Creazione Utenti
    const mario = await prisma.user.create({
        data: {
            email: 'mario.rossi@example.com',
            password: 'password_hashed_123', // In produzione usare bcrypt/argon2
            name: 'Mario',
            surname: 'Rossi',
            role: 'ORGANIZZATORE',
            addressUser: 'Via Toledo 10, Napoli',
            latitude: 40.83988,
            longitude: 14.24949,
            favoriteSports: ['CALCIO', 'PADEL'],
            maxNotificationDist: 15,
        },
    });

    const luigi = await prisma.user.create({
        data: {
            email: 'luigi.verdi@example.com',
            password: 'password_hashed_123',
            name: 'Luigi',
            surname: 'Verdi',
            role: 'SPORTIVO',
            addressUser: 'Corso Umberto I 50, Napoli',
            latitude: 40.84651,
            longitude: 14.25897,
            favoriteSports: ['BASKET', 'TENNIS'],
            maxNotificationDist: 10,
        },
    });

    console.log('✔️ Utenti creati:', { mario: mario.name, luigi: luigi.name });

    // 2. Creazione Strutture Sportive (Gyms)
    const gymPadel = await prisma.gym.create({
        data: {
            name: 'Partenope Padel Club',
            address: 'Via Arenella 40, Napoli',
            latitude: 40.85211,
            longitude: 14.22987,
        },
    });

    const gymCalcio = await prisma.gym.create({
        data: {
            name: 'Centro Sportivo Vomero',
            address: 'Via Cilea 120, Napoli',
            latitude: 40.84321,
            longitude: 14.22154,
        },
    });

    console.log('✔️ Strutture sportive create:', [gymPadel.name, gymCalcio.name]);

    // 3. Creazione Cerchia
    const circleAmici = await prisma.circle.create({
        data: {
            name: 'Padel del Giovedì',
            boardText: 'Ragazzi confermate sempre la presenza entro il martedì sera!',
            ownerId: mario.id,
            members: {
                connect: [{ id: mario.id }, { id: luigi.id }],
            },
        },
    });

    console.log('✔️ Cerchia creata:', circleAmici.name);

    // 4. Creazione Eventi
    const event1 = await prisma.event.create({
        data: {
            title: 'Partita di Padel 2vs2',
            description: 'Cerchiamo due giocatori di livello intermedio per completare un campo.',
            sport: 'PADEL',
            dateStart: new Date(Date.now() + 86400000 * 2), // Tra 2 giorni
            location: gymPadel.address,
            latitude: gymPadel.latitude,
            longitude: gymPadel.longitude,
            maxPlayers: 4,
            status: 'OPEN',
            isPrivate: false,
            creatorId: mario.id,
            gymId: gymPadel.id,
            participants: {
                connect: [{ id: mario.id }, { id: luigi.id }],
            },
        },
    });

    const event2 = await prisma.event.create({
        data: {
            title: 'Calcetto 5vs5 Amatoriale',
            description: 'Partita tranquilla post-lavoro. Nessun agonismo eccessivo.',
            sport: 'CALCIO',
            dateStart: new Date(Date.now() + 86400000 * 5), // Tra 5 giorni
            location: gymCalcio.address,
            latitude: gymCalcio.latitude,
            longitude: gymCalcio.longitude,
            maxPlayers: 10,
            status: 'OPEN',
            isPrivate: true,
            creatorId: mario.id,
            gymId: gymCalcio.id,
            circleId: circleAmici.id,
            participants: {
                connect: [{ id: mario.id }],
            },
        },
    });

    console.log('✔️ Eventi creati:', [event1.title, event2.title]);
    console.log('🚀 Seeding completato con successo!');
}

main()
    .catch((e) => {
        console.error('❌ Errore durante il seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });