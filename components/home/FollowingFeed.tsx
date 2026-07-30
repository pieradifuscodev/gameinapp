"use client";

import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import PrivateEventCard from "@/components/events/PrivateEventCard";
import PromotedEventCard from "@/components/events/PromotedEventCard";

type EventData = {
  id: string;
  title: string;
  description: string;
  sport: string;
  location: string;
  distanceInKm: number;
  maxPlayers: number;
  price: number | null;
  skillLevel: string | null;
  genderPreference: string | null;
  dateStart: string;
  status: string;
  gym: { id: string; name: string; address: string };
  creator: { id: string; name: string; surname: string; email: string; role: string };
};

interface FollowingFeedProps {
  coords: { lat: number; lng: number } | null;
}

export function FollowingFeed({ coords }: FollowingFeedProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowingEvents = async () => {
      try {
        const url = coords ? `/api/events/following?lat=${coords.lat}&lng=${coords.lng}` : `/api/events/following`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Impossibile caricare gli eventi");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowingEvents();
  }, [coords]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold text-sm">Caricamento bacheca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[13px] text-center">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mx-4 my-8 p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
        <Users size={32} className="mx-auto mb-3 text-slate-300" />
        <p className="text-slate-500 text-sm font-medium">
          La tua bacheca è vuota.
        </p>
        <p className="text-slate-400 text-[13px] mt-2">
          Visita il profilo degli organizzatori dalla mappa ed inizia a seguirli per vedere qui i loro eventi in programma!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-28 pb-24">
      {events.map(event => (
        event.creator.role === "ORGANIZER" ? (
          <PromotedEventCard key={event.id} event={event} isBanner={false} />
        ) : (
          <PrivateEventCard key={event.id} event={event} />
        )
      ))}
    </div>
  );
}
