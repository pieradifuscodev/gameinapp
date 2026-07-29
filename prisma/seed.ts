import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Inizio popolamento del database (Seeding)...');

    // Clean-up
    await prisma.notification.deleteMany();
    await prisma.event.deleteMany();
    await prisma.circle.deleteMany();
    await prisma.gym.deleteMany();
    // Delete follow relationships first
    const users = await prisma.user.findMany();
    for (const u of users) {
        await prisma.user.update({
            where: { id: u.id },
            data: {
                following: { disconnect: users.map(x => ({ id: x.id })) },
                followedBy: { disconnect: users.map(x => ({ id: x.id })) }
            }
        });
    }
    await prisma.user.deleteMany();

    console.log('🧹 Database ripulito con successo.');

    // 1. Creazione Utenti Sportivi e Organizzatori
    const usersData = [
        {
            email: 'mario.rossi@example.com',
            username: 'mariorossi88',
            name: 'Mario',
            surname: 'Rossi',
            role: 'SPORTIVO',
            bio: 'Appassionato di calcio e padel. Organizzo partite ogni settimana a Napoli.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=mario',
            addressUser: 'Via Toledo 10, Napoli',
            latitude: 40.83988,
            longitude: 14.24949,
            favoriteSports: ['CALCIO', 'PADEL'],
            maxNotificationDist: 15,
        },
        {
            email: 'luigi.verdi@example.com',
            username: 'luigiv99',
            name: 'Luigi',
            surname: 'Verdi',
            role: 'SPORTIVO',
            bio: 'Tento sempre di migliorare a Tennis e Basket. Cerco compagni per allenarmi.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=luigi',
            addressUser: 'Corso Umberto I 50, Napoli',
            latitude: 40.84651,
            longitude: 14.25897,
            favoriteSports: ['BASKET', 'TENNIS'],
            maxNotificationDist: 10,
        },
        {
            email: 'giulia.bianchi@example.com',
            username: 'giulia_b',
            name: 'Giulia',
            surname: 'Bianchi',
            role: 'SPORTIVO',
            bio: 'Insegnante di Yoga e appassionata di corsa all\'aria aperta.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=giulia',
            addressUser: 'Via Chiaia 150, Napoli',
            latitude: 40.83691,
            longitude: 14.24432,
            favoriteSports: ['YOGA', 'RUNNING'],
            maxNotificationDist: 8,
        },
        {
            email: 'marco.esposito@example.com',
            username: 'marko_expo',
            name: 'Marco',
            surname: 'Esposito',
            role: 'SPORTIVO',
            bio: 'Futsal (calcetto) e beach volley sono la mia vita. Sempre pronto per un match.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=marco',
            addressUser: 'Via Posillipo 20, Napoli',
            latitude: 40.81977,
            longitude: 14.20845,
            favoriteSports: ['CALCETTO', 'BEACH_VOLLEY'],
            maxNotificationDist: 20,
        },
        {
            email: 'francesca.napoli@example.com',
            username: 'fran_naples',
            name: 'Francesca',
            surname: 'Napoli',
            role: 'SPORTIVO',
            bio: 'Ballo moderno, hip hop e nuoto. Mi piace tenermi sempre attiva!',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=francesca',
            addressUser: 'Via Scarlatti 80, Napoli (Vomero)',
            latitude: 40.84439,
            longitude: 14.22851,
            favoriteSports: ['BALLO', 'NUOTO', 'HIP_HOP'],
            maxNotificationDist: 5,
        },
        {
            email: 'antonio.ferrara@example.com',
            username: 'anto_fe',
            name: 'Antonio',
            surname: 'Ferrara',
            role: 'SPORTIVO',
            bio: 'Organizzo tornei di Padel amatoriali. Contattatemi per prenotare o partecipare.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=antonio',
            addressUser: 'Via Duomo 200, Napoli',
            latitude: 40.85102,
            longitude: 14.25998,
            favoriteSports: ['PADEL', 'TENNIS'],
            maxNotificationDist: 15,
        },
        {
            email: 'sofia.sorrentino@example.com',
            username: 'sofia_sorr',
            name: 'Sofia',
            surname: 'Sorrentino',
            role: 'SPORTIVO',
            bio: 'Cintura nera di Karate, pratico arti marziali e ginnastica artistica.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=sofia',
            addressUser: 'Via Salvator Rosa 300, Napoli',
            latitude: 40.85412,
            longitude: 14.24551,
            favoriteSports: ['ARTI_MARZIALI', 'GINNASTICA'],
            maxNotificationDist: 12,
        },
        {
            email: 'davide.romano@example.com',
            username: 'dave_romano',
            name: 'Davide',
            surname: 'Romano',
            role: 'SPORTIVO',
            bio: 'Nuotatore amatoriale e ciclista nel weekend. Amo le lunghe pedalate sulla costa.',
            avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=davide',
            addressUser: 'Via Partenope 10, Napoli',
            latitude: 40.83195,
            longitude: 14.24831,
            favoriteSports: ['NUOTO', 'CICLISMO'],
            maxNotificationDist: 25,
        }
    ];

    const createdUsers = [];
    for (const u of usersData) {
        const user = await prisma.user.create({
            data: {
                ...u,
                password: 'password_hashed_123', // Password di test
            }
        });
        createdUsers.push(user);
    }

    console.log(`✔️ Creati ${createdUsers.length} utenti (sportivi/organizzatori).`);

    // 2. Creazione Strutture Sportive (Gyms)
    const structuresData = [
        {
            email: 'info@partenopepadel.com',
            username: 'partenopepadel',
            companyName: 'Partenope Padel Club A.S.D.',
            vatNumber: '01234567890',
            role: 'STRUTTURA',
            bio: 'Il club di padel più grande al Vomero. 4 campi panoramici coperti di ultima generazione.',
            avatar: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=150&h=150&fit=crop',
            facilityImages: [
                'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop'
            ],
            addressUser: 'Via Arenella 40, Napoli',
            latitude: 40.85211,
            longitude: 14.22987,
        },
        {
            email: 'info@centrosportivovomero.com',
            username: 'csvomero',
            companyName: 'Centro Sportivo Vomero',
            vatNumber: '09876543210',
            role: 'STRUTTURA',
            bio: 'Centro multisportivo storico al Vomero: 2 campi da calcetto, 3 da tennis in terra rossa, 1 piscina coperta.',
            avatar: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=150&h=150&fit=crop',
            facilityImages: [
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
                'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop'
            ],
            addressUser: 'Via Cilea 120, Napoli',
            latitude: 40.84321,
            longitude: 14.22154,
        },
        {
            email: 'info@arenamegellina.com',
            username: 'arenamegellina',
            companyName: 'Mergellina Beach Arena',
            vatNumber: '04561237890',
            role: 'STRUTTURA',
            bio: 'La prima arena sulla spiaggia a Mergellina: 3 campi da beach volley, area fitness e surf center.',
            avatar: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop',
            facilityImages: [
                'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&h=400&fit=crop'
            ],
            addressUser: 'Via Caracciolo 50, Napoli',
            latitude: 40.82845,
            longitude: 14.22102,
        }
    ];

    const createdStructures = [];
    for (const s of structuresData) {
        const structure = await prisma.user.create({
            data: {
                ...s,
                password: 'password_hashed_123',
            }
        });
        createdStructures.push(structure);
    }

    console.log(`✔️ Create ${createdStructures.length} strutture sportive (Profili Utente).`);

    // Creazione corrispondente delle palestre (Gym model) per l'assegnazione ai campi/eventi
    const gymPadel = await prisma.gym.create({
        data: {
            name: 'Partenope Padel Club',
            address: 'Via Arenella 40, Napoli',
            latitude: 40.85211,
            longitude: 14.22987,
        }
    });

    const gymCSVomero = await prisma.gym.create({
        data: {
            name: 'Centro Sportivo Vomero',
            address: 'Via Cilea 120, Napoli',
            latitude: 40.84321,
            longitude: 14.22154,
        }
    });

    const gymBeach = await prisma.gym.create({
        data: {
            name: 'Mergellina Beach Arena',
            address: 'Via Caracciolo 50, Napoli',
            latitude: 40.82845,
            longitude: 14.22102,
        }
    });

    console.log('✔️ Database Gym creato ed allineato.');

    // 3. Creazione Reti Sociali (Following/Followers)
    const mario = createdUsers[0];
    const luigi = createdUsers[1];
    const giulia = createdUsers[2];
    const marco = createdUsers[3];
    const francesca = createdUsers[4];
    const antonio = createdUsers[5];
    const sofia = createdUsers[6];
    const davide = createdUsers[7];

    const structPadel = createdStructures[0];
    const structVomero = createdStructures[1];

    // Impostiamo relazioni di follow reciproche e asimmetriche
    await prisma.user.update({
        where: { id: mario.id },
        data: {
            following: { connect: [{ id: luigi.id }, { id: marco.id }, { id: structPadel.id }, { id: structVomero.id }] },
            followedBy: { connect: [{ id: luigi.id }, { id: giulia.id }, { id: francesca.id }] }
        }
    });

    await prisma.user.update({
        where: { id: luigi.id },
        data: {
            following: { connect: [{ id: mario.id }, { id: giulia.id }, { id: structVomero.id }] },
            followedBy: { connect: [{ id: mario.id }, { id: antonio.id }] }
        }
    });

    await prisma.user.update({
        where: { id: giulia.id },
        data: {
            following: { connect: [{ id: mario.id }, { id: francesca.id }, { id: davide.id }] },
            followedBy: { connect: [{ id: luigi.id }, { id: francesca.id }] }
        }
    });

    await prisma.user.update({
        where: { id: francesca.id },
        data: {
            following: { connect: [{ id: giulia.id }, { id: davide.id }, { id: structVomero.id }] },
            followedBy: { connect: [{ id: giulia.id }, { id: marco.id }] }
        }
    });

    console.log('✔️ Relazioni Follower/Following popolate come Instagram.');

    // 4. Creazione Cerchie
    const circlePadel = await prisma.circle.create({
        data: {
            name: 'Padel Vomero Elite',
            boardText: 'Pronti per la sfida del giovedì sera! Prenotiamo fisso alla Partenope.',
            ownerId: mario.id,
            members: {
                connect: [{ id: mario.id }, { id: luigi.id }, { id: antonio.id }, { id: marco.id }]
            }
        }
    });

    const circleCorsa = await prisma.circle.create({
        data: {
            name: 'Napoli Runners',
            boardText: 'Domenica mattina corsa sul Lungomare Caracciolo, ore 8:00 rotonda Diaz.',
            ownerId: giulia.id,
            members: {
                connect: [{ id: giulia.id }, { id: francesca.id }, { id: davide.id }]
            }
        }
    });

    console.log('✔️ Cerchie create:', [circlePadel.name, circleCorsa.name]);

    // 5. Creazione Eventi Futuri e Passati
    // Evento 1: Padel 2vs2 (Futuro, Aperto)
    const eventPadel = await prisma.event.create({
        data: {
            title: 'Partita Padel 2v2 Intermedio',
            description: 'Cerchiamo l\'ultimo giocatore per un doppio equilibrato. Livello 3.0-4.0.',
            sport: 'PADEL',
            dateStart: new Date(Date.now() + 86400000 * 2), // Tra 2 giorni
            location: gymPadel.address,
            latitude: gymPadel.latitude,
            longitude: gymPadel.longitude,
            maxPlayers: 4,
            status: 'OPEN',
            isPrivate: false,
            price: 10.0,
            skillLevel: 'Intermedio',
            genderPreference: 'Misto',
            creatorId: mario.id,
            gymId: gymPadel.id,
            participants: {
                connect: [{ id: mario.id }, { id: luigi.id }, { id: antonio.id }]
            }
        }
    });

    // Evento 2: Calcetto 5vs5 (Futuro, Privato della Cerchia)
    const eventCalcio = await prisma.event.create({
        data: {
            title: 'Calcetto 5vs5 Classico',
            description: 'Partita settimanale della nostra cerchia. Portate la maglia bianca e nera.',
            sport: 'CALCETTO',
            dateStart: new Date(Date.now() + 86400000 * 4), // Tra 4 giorni
            location: gymCSVomero.address,
            latitude: gymCSVomero.latitude,
            longitude: gymCSVomero.longitude,
            maxPlayers: 10,
            status: 'OPEN',
            isPrivate: true,
            price: 7.50,
            skillLevel: 'Qualsiasi',
            genderPreference: 'Solo Uomini',
            creatorId: mario.id,
            gymId: gymCSVomero.id,
            circleId: circlePadel.id,
            participants: {
                connect: [{ id: mario.id }, { id: luigi.id }, { id: marco.id }]
            }
        }
    });

    // Evento 3: Allenamento Yoga di Gruppo (Futuro, Aperto)
    const eventYoga = await prisma.event.create({
        data: {
            title: 'Hatha Yoga al Tramonto',
            description: 'Sessione di rilassamento all\'aperto. Portate il vostro tappetino personale.',
            sport: 'YOGA',
            dateStart: new Date(Date.now() + 86400000 * 1), // Domani
            location: 'Villa Comunale di Napoli, Chiaia',
            latitude: 40.83350,
            longitude: 14.23845,
            maxPlayers: 20,
            status: 'OPEN',
            isPrivate: false,
            price: 5.0,
            skillLevel: 'Principiante',
            genderPreference: 'Misto',
            creatorId: giulia.id,
            participants: {
                connect: [{ id: giulia.id }, { id: francesca.id }]
            }
        }
    });

    // Evento 4: Basket 3v3 Metropolitano (Passato, Concluso)
    const eventBasket = await prisma.event.create({
        data: {
            title: 'Basket 3v3 Campetto',
            description: 'Sfida pomeridiana al campetto pubblico.',
            sport: 'BASKET',
            dateStart: new Date(Date.now() - 86400000 * 3), // 3 giorni fa
            location: 'Campetti di Viale Virgiliano, Posillipo',
            latitude: 40.80321,
            longitude: 14.18491,
            maxPlayers: 6,
            status: 'COMPLETED',
            isPrivate: false,
            creatorId: luigi.id,
            participants: {
                connect: [{ id: luigi.id }, { id: marco.id }, { id: davide.id }]
            }
        }
    });

    // Evento 5: Beach Volley 2v2 Maschile (Futuro, Aperto)
    const eventBeach = await prisma.event.create({
        data: {
            title: 'Beach Volley 2v2 di Fuoco',
            description: 'Sfida sulla sabbia di Mergellina. Solo giocatori esperti.',
            sport: 'BEACH_VOLLEY',
            dateStart: new Date(Date.now() + 86400000 * 3), // Tra 3 giorni
            location: gymBeach.address,
            latitude: gymBeach.latitude,
            longitude: gymBeach.longitude,
            maxPlayers: 4,
            status: 'OPEN',
            isPrivate: false,
            price: 12.0,
            skillLevel: 'Avanzato',
            genderPreference: 'Solo Uomini',
            creatorId: marco.id,
            gymId: gymBeach.id,
            participants: {
                connect: [{ id: marco.id }, { id: davide.id }]
            }
        }
    });

    console.log('✔️ Eventi creati:', [eventPadel.title, eventCalcio.title, eventYoga.title, eventBasket.title, eventBeach.title]);

    // 6. Creazione Notifiche di Test
    await prisma.notification.createMany({
        data: [
            {
                userId: mario.id,
                type: 'FOLLOW',
                title: 'Nuovo Follower!',
                message: 'Giulia Bianchi ha iniziato a seguirti.',
                link: `/profile/${giulia.id}`,
                isRead: false,
            },
            {
                userId: mario.id,
                type: 'EVENT_JOIN',
                title: 'Nuovo partecipante',
                message: 'Luigi Verdi si è iscritto alla tua partita di Calcetto.',
                link: `/events/${eventCalcio.id}`,
                isRead: false,
            },
            {
                userId: luigi.id,
                type: 'CIRCLE_INVITE',
                title: 'Invito in una Cerchia',
                message: 'Mario ti ha invitato ad unirti a "Padel Vomero Elite".',
                link: `/circles/${circlePadel.id}`,
                isRead: false,
            }
        ]
    });

    console.log('✔️ Notifiche di test create.');
    console.log('🚀 Popolamento del database (Seeding) completato con successo!');
}

main()
    .catch((e) => {
        console.error('❌ Errore durante il seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });