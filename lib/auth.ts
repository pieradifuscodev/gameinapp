import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "mario.rossi@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e password sono obbligatori");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Utente non trovato");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Password errata");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          latitude: user.latitude,
          longitude: user.longitude,
          favoriteSports: user.favoriteSports,
          username: user.username,
          avatar: user.avatar,
          companyName: user.companyName,
          vatNumber: user.vatNumber,
          maxNotificationDist: user.maxNotificationDist,
          bio: user.bio,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.latitude = (user as any).latitude;
        token.longitude = (user as any).longitude;
        token.username = (user as any).username;
        token.name = (user as any).name;
        token.surname = (user as any).surname;
        token.companyName = (user as any).companyName;
      }
      if (trigger === "update" && session) {
        token.latitude = session.latitude ?? token.latitude;
        token.longitude = session.longitude ?? token.longitude;
        token.name = session.name ?? token.name;
        token.surname = session.surname ?? token.surname;
        token.username = session.username ?? token.username;
        token.companyName = session.companyName ?? token.companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).latitude = token.latitude;
        (session.user as any).longitude = token.longitude;
        (session.user as any).name = token.name;
        (session.user as any).surname = token.surname;
        (session.user as any).username = token.username;
        (session.user as any).companyName = token.companyName;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
};
