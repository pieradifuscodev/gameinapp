import { NextResponse } from "next/server";

/**
 * GET /api/geo
 *
 * Server-side proxy for IP-based geolocation.
 * Tries ip-api.com first (free, 1000 req/min, no key needed).
 * Falls back to ipapi.co if the first provider fails.
 *
 * Returns: { lat, lng, city, country, accuracy }
 */

/** Returns true for loopback and RFC-1918 private addresses. */
function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    /^10\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^::ffff:127\./.test(ip)
  );
}

export async function GET(req: Request) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const rawIp = forwarded ? forwarded.split(",")[0].trim() : "";

    // Skip private/loopback IPs — ip-api.com returns "fail: private range" for them.
    // When no public IP is known, call without an IP param so ip-api uses
    // the server's own outbound IP (public in production).
    const useIp = rawIp && !isPrivateIp(rawIp) ? rawIp : "";

    const ipApiUrl = useIp
      ? `http://ip-api.com/json/${useIp}?fields=status,message,lat,lon,city,country`
      : `http://ip-api.com/json/?fields=status,message,lat,lon,city,country`;

    const ipApiRes = await fetch(ipApiUrl, {
      next: { revalidate: 300 },
    } as RequestInit);

    if (ipApiRes.ok) {
      const data = await ipApiRes.json();
      if (data.status === "success" && data.lat && data.lon) {
        return NextResponse.json(
          {
            lat: data.lat,
            lng: data.lon,
            city: data.city ?? null,
            country: data.country ?? null,
            accuracy: "city",
          },
          {
            status: 200,
            headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" },
          }
        );
      }
      // ip-api returned status:"fail" (e.g. private range in dev) — try secondary provider
      console.warn("[/api/geo] ip-api.com failed:", data.message ?? "unknown reason");
    }

    // Secondary fallback: ipapi.co — works from localhost in dev, no key needed
    const ipapiRes = await fetch("https://ipapi.co/json/", {
      headers: { "User-Agent": "gameinapp/1.0" },
      next: { revalidate: 300 },
    } as RequestInit);

    if (ipapiRes.ok) {
      const data = await ipapiRes.json();
      if (data.latitude && data.longitude) {
        return NextResponse.json(
          {
            lat: data.latitude,
            lng: data.longitude,
            city: data.city ?? null,
            country: data.country_name ?? null,
            accuracy: "city",
          },
          {
            status: 200,
            headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" },
          }
        );
      }
    }

    return NextResponse.json(
      { error: "Tutti i provider di geolocalizzazione IP hanno fallito." },
      { status: 502 }
    );
  } catch (error) {
    console.error("[/api/geo] Error:", error);
    return NextResponse.json(
      { error: "Impossibile determinare la posizione tramite IP." },
      { status: 500 }
    );
  }
}
