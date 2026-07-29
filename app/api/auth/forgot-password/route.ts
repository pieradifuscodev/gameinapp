import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email richiesta" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      // Return 200 even if user doesn't exist for security reasons
      return NextResponse.json({ message: "Se l'email esiste, ti abbiamo inviato un link di reset." }, { status: 200 });
    }

    const verificationToken = await generateVerificationToken(email);
    
    // In un ambiente reale questo dovrebbe essere gestito con try/catch per evitare che fallisca se non c'è l'SMTP
    try {
      await sendPasswordResetEmail(verificationToken.identifier, verificationToken.token);
    } catch (e) {
      console.warn("Nodemailer non configurato o fallito, ma il token è stato generato", e);
    }

    return NextResponse.json({ message: "Se l'email esiste, ti abbiamo inviato un link di reset." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
