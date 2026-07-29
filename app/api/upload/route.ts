import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    // Crea un nome file univoco
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generiamo un hash per il nome del file per evitare conflitti e caratteri strani
    const hash = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.name) || '.jpg';
    const filename = `${hash}${extension}`;

    // Percorso in cui salvare: public/uploads/
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Assicuriamoci che la cartella esista
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Restituiamo il path pubblico (partendo dalla root / per indicare la root del dominio)
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Errore durante l'upload:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
