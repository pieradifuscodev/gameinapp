import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ unreadCount: 0 }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return NextResponse.json({ unreadCount: count }, { status: 200 });
  } catch (error) {
    console.error("Errore conteggio notifiche:", error);
    return NextResponse.json({ unreadCount: 0 }, { status: 500 });
  }
}
