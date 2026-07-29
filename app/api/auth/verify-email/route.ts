import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=TokenMancante", req.url));
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      return NextResponse.redirect(new URL("/login?error=TokenInvalido", req.url));
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.redirect(new URL("/login?error=TokenScaduto", req.url));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.identifier }
    });

    if (!existingUser) {
      return NextResponse.redirect(new URL("/login?error=UtenteNonTrovato", req.url));
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.identifier,
      }
    });

    await prisma.verificationToken.delete({
      where: { token }
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login?error=ErroreInterno", req.url));
  }
}
