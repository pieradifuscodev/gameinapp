"use client";

import { useState, useEffect, useCallback } from "react";

export type GeoSource = "gps" | "network" | "ip" | null;

export type GeoCoords = {
  lat: number;
  lng: number;
};

export type UseGeolocationReturn = {
  coords: GeoCoords | null;
  source: GeoSource;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const GEO_ERROR_MESSAGES: Record<number, string> = {
  1: "Permesso di geolocalizzazione negato. Abilitalo nelle impostazioni del browser.",
  2: "Segnale GPS non disponibile.",
  3: "Timeout durante il recupero della posizione.",
};

const GEO_OPTIONS_HIGH: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 8_000,
  maximumAge: 30_000,
};

const GEO_OPTIONS_LOW: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8_000,
  maximumAge: 60_000,
};

export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [source, setSource] = useState<GeoSource>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setCoords(null);
    setSource(null);
    setError(null);
    setLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const succeed = (lat: number, lng: number, src: GeoSource) => {
      if (cancelled) return;
      setCoords({ lat, lng });
      setSource(src);
      setLoading(false);
      setError(null);
    };

    const fail = (message: string) => {
      if (cancelled) return;
      setError(message);
      setLoading(false);
    };

    // Level 3 — IP-based geolocation via our own server-side proxy
    const fallbackToIP = async () => {
      try {
        const res = await fetch("/api/geo");
        if (!res.ok) throw new Error("IP geolocation failed");
        const data = await res.json();
        if (typeof data.lat === "number" && typeof data.lng === "number") {
          succeed(data.lat, data.lng, "ip");
        } else {
          throw new Error("Invalid response from /api/geo");
        }
      } catch {
        fail(
          "Impossibile determinare la posizione. Controlla la connessione o i permessi del browser."
        );
      }
    };

    // Level 2 — retry without highAccuracy (works better on desktop/simulator)
    const retryWithLowAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => succeed(pos.coords.latitude, pos.coords.longitude, "network"),
        () => fallbackToIP(),
        GEO_OPTIONS_LOW
      );
    };

    // Level 1 — native GPS with high accuracy
    const startGPS = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => succeed(pos.coords.latitude, pos.coords.longitude, "gps"),
        (err) => {
          console.warn(`[useGeolocation] code=${err.code}: ${err.message}`);
          if (err.code === 1 /* PERMISSION_DENIED */) {
            // No retry — user explicitly denied
            fail(GEO_ERROR_MESSAGES[1]);
          } else {
            // code 2 POSITION_UNAVAILABLE or code 3 TIMEOUT → retry
            retryWithLowAccuracy();
          }
        },
        GEO_OPTIONS_HIGH
      );
    };

    if (!navigator.geolocation) {
      // Browser has no Geolocation API → skip straight to IP
      fallbackToIP();
    } else {
      startGPS();
    }

    return () => {
      cancelled = true;
    };
    // `attempt` is the only dependency — retriggers the effect on manual retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return { coords, source, loading, error, retry };
}
