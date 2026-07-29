import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isPublicRoute = ["/login", "/register", "/forgot-password", "/reset-password", "/api/auth"].some((path) =>
      pathname.startsWith(path)
    );

    if (isPublicRoute && token) {
      const isProfileComplete = 
        !!token.name && 
        !!token.username &&
        (
          (token.role === "SPORTIVO" && token.latitude != null && token.longitude != null) ||
          (token.role === "STRUTTURA" && !!token.companyName && token.latitude != null && token.longitude != null)
        );

      if (isProfileComplete) {
        return NextResponse.redirect(new URL("/", req.url));
      } else {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    if (!isPublicRoute && token) {
      const isProfileComplete = 
        !!token.name && 
        !!token.username &&
        (
          (token.role === "SPORTIVO" && token.latitude != null && token.longitude != null) ||
          (token.role === "STRUTTURA" && !!token.companyName && token.latitude != null && token.longitude != null)
        );

      if (!isProfileComplete && pathname !== "/onboarding" && !pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      
      if (isProfileComplete && pathname === "/onboarding") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const isPublicRoute = ["/login", "/register", "/forgot-password", "/reset-password", "/api/auth"].some((path) =>
          pathname.startsWith(path)
        );
        
        if (isPublicRoute) return true;
        
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|assets|favicon.ico|manifest.json|sw.js|icon-192x192.png|icon-512x512.png).*)",
  ],
};
