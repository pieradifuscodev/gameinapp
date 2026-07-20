"use client";

import { useEffect, useState } from "react";
import { MapPin, Search, Navigation, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";

type EventData = {
  id: string;
  title: string;
  sport: string;
  location: string;
  distanceInKm: number;
  dateStart: string;
  status: string;
  gym: { name: string; address: string };
  creator: { name: string; surname: string };
};

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [radius, setRadius] = useState(20);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
        setError("Impossibile ottenere la posizione. Verifica i permessi.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/search?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
        if (!res.ok) throw new Error("Errore durante la ricerca degli eventi");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [coords, radius]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-blue-600" />
          GameInApp
        </h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 font-medium">Raggio:</label>
          <select 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-gray-100 border-none rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        {deferredPrompt && (
          <div className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <p className="font-semibold text-sm">Installa l'App</p>
              <p className="text-xs opacity-90">Aggiungi GameInApp alla home</p>
            </div>
            <button onClick={handleInstallClick} className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm active:scale-95 transition-transform">
              Installa
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 items-start border border-red-100">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))
        ) : events.length === 0 && !error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
            <Search size={48} className="mb-4 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-600">Nessun evento trovato</h2>
            <p className="text-sm text-gray-500 mt-2">Prova ad aumentare il raggio di ricerca o torna più tardi.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-20">
            {events.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="block group">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {event.sport}
                    </span>
                    <span className="flex items-center text-xs font-semibold text-gray-500 gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <Navigation size={12} />
                      {event.distanceInKm < 1 
                        ? `${Math.round(event.distanceInKm * 1000)} m` 
                        : `${event.distanceInKm.toFixed(1)} km`}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{event.gym.name} • {new Date(event.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center text-xs font-bold">
                        {event.creator.name[0]}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{event.creator.name} {event.creator.surname}</span>
                    </div>
                    {event.status === 'OPEN' && (
                      <span className="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-1 rounded">Open</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
        <Plus size={24} />
      </button>
    </main>
  );
}
