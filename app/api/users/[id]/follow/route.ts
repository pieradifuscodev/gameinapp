import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Segui un utente
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: targetUserId } = await params;
    const currentUserId = (session.user as any).id;

    if (currentUserId === targetUserId) {
      return NextResponse.json({ error: "Non puoi seguire te stesso" }, { status: 400 });
    }

    // Controlla se l'utente bersaglio esiste
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Aggiungi la relazione di follow
    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          connect: { id: targetUserId }
        }
      }
    });

    return NextResponse.json({ message: "Utente seguito con successo" }, { status: 200 });
  } catch (error) {
    console.error("Errore durante il follow:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}

// DELETE: Non seguire più un utente (Unfollow)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { id: targetUserId } = await params;
    const currentUserId = (session.user as any).id;

    // Rimuovi la relazione di follow
    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          disconnect: { id: targetUserId }
        }
      }
    });

    return NextResponse.json({ message: "Utente non più seguito" }, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'unfollow:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
