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
    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Errore recupero profilo:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { 
      name, surname, username, email, avatar, 
      companyName, vatNumber, role,
      latitude, longitude, addressUser, favoriteSports, maxNotificationDist, bio, facilityImages
    } = body;

    // Se si cambia email o username, controlliamo l'unicità
    if (email || username) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email ? [{ email }] : []),
            ...(username ? [{ username }] : [])
          ],
          NOT: { id: userId }
        }
      });
      if (existing) {
        if (existing.email === email) return NextResponse.json({ error: "Email già in uso da un altro utente" }, { status: 409 });
        if (existing.username === username) return NextResponse.json({ error: "Username già in uso" }, { status: 409 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name !== undefined ? name : undefined,
        surname: surname !== undefined ? surname : undefined,
        username: username !== undefined ? username : undefined,
        email: email !== undefined ? email : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        role: role !== undefined ? role : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        vatNumber: vatNumber !== undefined ? vatNumber : undefined,
        latitude: latitude !== undefined ? latitude : undefined,
        longitude: longitude !== undefined ? longitude : undefined,
        addressUser: addressUser !== undefined ? addressUser : undefined,
        favoriteSports: favoriteSports !== undefined ? favoriteSports : undefined,
        maxNotificationDist: maxNotificationDist !== undefined ? Number(maxNotificationDist) : undefined,
        bio: bio !== undefined ? bio : undefined,
        facilityImages: facilityImages !== undefined ? facilityImages : undefined,
      },
    });

    return NextResponse.json({ message: "Profilo aggiornato", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Errore aggiornamento profilo:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
