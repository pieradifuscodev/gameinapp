import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name, surname, role } = await req.json();

    if (!email || !password || !name || !surname) {
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "L'email è già in uso" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        role: role || "SPORTIVO", // Ruolo di default
      }
    });

    return NextResponse.json(
      { message: "Registrazione completata con successo", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
