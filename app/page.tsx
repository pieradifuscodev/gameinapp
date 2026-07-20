"use client";

import { useEffect, useState } from "react";
import { MapPin, Search, Navigation, AlertCircle, Plus, Map as MapIcon, List as ListIcon, Star, Filter, TrendingUp, Building2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { SPORTS, getSportDetails } from "@/lib/sports";
import MapWrapper from "@/components/ui/MapWrapper";

type EventData = {
  id: string;
  title: string;
  sport: string;
  location: string;
  distanceInKm: number;
  dateStart: string;
  status: string;
  gym: { id: string; name: string; address: string };
  creator: { id: string; name: string; surname: string; email: string; role: string };
};

type GymData = {
  id: string;
  name: string;
  address: string;
  distanceInKm: number;
};

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [radius, setRadius] = useState(20);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PRIVATE" | "ORGANIZER">("ALL");

  const hour = new Date().getHours();
  let greeting = "Bentornato!";
  if (hour < 12) greeting = "Buongiorno!";
  else if (hour < 18) greeting = "Buon pomeriggio!";
  else greeting = "Buonasera!";

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
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
        const sportQuery = selectedSport ? `&sport=${selectedSport}` : "";
        const res = await fetch(`/api/events/search?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}${sportQuery}`);
        if (!res.ok) throw new Error("Errore durante la ricerca degli eventi");
        const data = await res.json();
        setEvents(data.events || []);
        setGyms(data.gyms || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [coords, radius, selectedSport]);

  // Derived state
  const promotedEvents = events.filter(e => e.creator.role === "ORGANIZER").slice(0, 5);

  let filteredEvents = events;
  if (filterType === "PRIVATE") filteredEvents = events.filter(e => e.creator.role !== "ORGANIZER");
  if (filterType === "ORGANIZER") filteredEvents = events.filter(e => e.creator.role === "ORGANIZER");
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(q) || e.gym.name.toLowerCase().includes(q));
  }

  // UI Components
  const renderEventCard = (event: EventData, isBanner = false) => {
    const sport = getSportDetails(event.sport);
    return (
      <Link href={`/events/${event.id}`} key={event.id} className={`block group shrink-0 ${isBanner ? 'w-80' : 'w-64'} snap-start`}>
        <div className={`bg-white rounded-3xl p-4 shadow-sm border-2 border-gray-100 active:border-gray-200 transition-colors relative overflow-hidden h-full flex flex-col`}>
          {isBanner && (
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1 shadow-sm">
              <Star size={10} className="fill-current" /> Promosso
            </div>
          )}

          <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${sport.shapeColor} blur-2xl opacity-40`}></div>

          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className={`text-[10px] font-black uppercase tracking-wider ${sport.pillText} ${sport.pillColor} px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1`}>
              <span className="text-sm">{sport.icon}</span> {sport.label}
            </span>
            <span className="flex items-center text-[10px] font-bold text-gray-600 gap-1 bg-gray-100/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200">
              <Navigation size={10} className="text-gray-400" />
              {event.distanceInKm < 1 ? `${Math.round(event.distanceInKm * 1000)}m` : `${event.distanceInKm.toFixed(1)}km`}
            </span>
          </div>

          <h3 className={`font-black text-gray-900 ${isBanner ? 'text-xl' : 'text-lg'} mb-1 leading-tight relative z-10 line-clamp-2 flex-1`}>{event.title}</h3>

          <div className="mt-3 relative z-10">
            <p className="text-xs text-gray-600 mb-3 font-medium flex items-center gap-1.5 truncate">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              <span className="truncate">{event.gym.name}</span>
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${sport.color} text-white flex items-center justify-center text-[10px] font-bold shadow-sm`}>
                  {event.creator.name[0]}
                </div>
                <span className="text-[10px] text-gray-700 font-bold truncate max-w-[100px]">{event.creator.name} {event.creator.surname}</span>
              </div>
              <div className="text-[10px] font-black text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                {new Date(event.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">

      {/* Search Header */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm relative z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{greeting}</h1>
            <p className="text-gray-500 text-sm font-medium">Scopri cosa succede intorno a te.</p>
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca eventi o palestre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 text-sm rounded-2xl py-3.5 pl-11 pr-4 font-medium outline-none focus:ring-2 focus:ring-primary/80 transition-all border border-transparent focus:border-primary/30 focus:bg-white"
          />
        </div>
      </div>

      {/* Quick Filters (Sports) */}
      <div className="bg-white px-4 pb-4 border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 snap-x">
          <button
            onClick={() => setSelectedSport(null)}
            className={`snap-start shrink-0 px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${!selectedSport ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 bg-white text-gray-600'}`}
          >
            Tutti
          </button>
          {SPORTS.map(sport => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`snap-start shrink-0 px-4 py-2 rounded-full border-2 text-xs font-bold flex items-center gap-1.5 transition-all ${selectedSport === sport.id ? `${sport.color.replace('bg-', 'border-')} ${sport.color} text-white shadow-md` : 'border-gray-200 bg-white text-gray-600'}`}
            >
              <span>{sport.icon}</span> {sport.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center h-[50vh] text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-4"></div>
          <p className="font-bold">Ricerca in corso...</p>
        </div>
      ) : error ? (
        <div className="m-4 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm flex gap-2 items-start"><AlertCircle size={20} className="shrink-0" />{error}</div>
      ) : (
        <div className="flex flex-col gap-8 py-6 overflow-y-auto">

          {/* Section: Promoted Events (Banners) */}
          {!searchQuery && promotedEvents.length > 0 && (
            <section className="px-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-yellow-500" />
                <h2 className="font-black text-gray-900 text-lg">Le Promozioni delle Strutture</h2>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x pr-8">
                {promotedEvents.map(event => renderEventCard(event, true))}
              </div>
            </section>
          )}

          {/* Section: Nearby Events */}
          <section className="px-4">
            <div className="mb-3 flex justify-between items-end">
              <div>
                <h2 className="font-black text-gray-900 text-lg">Eventi in Zona</h2>
                <div className="flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded mt-1 w-fit">
                  <MapPin size={10} /> Entro {radius} km
                </div>
              </div>
              <div className="flex gap-1 bg-gray-200/60 p-1 rounded-xl">
                <button onClick={() => setIsMapView(false)} className={`p-1.5 rounded-lg ${!isMapView ? 'bg-white shadow-sm' : 'text-gray-500'}`}><ListIcon size={14} /></button>
                <button onClick={() => setIsMapView(true)} className={`p-1.5 rounded-lg ${isMapView ? 'bg-white shadow-sm' : 'text-gray-500'}`}><MapIcon size={14} /></button>
              </div>
            </div>

            {/* Sub-filters Organizer vs Private */}
            <div className="mb-4 flex gap-2">
              <button onClick={() => setFilterType("ALL")} className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border ${filterType === 'ALL' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>Tutti</button>
              <button onClick={() => setFilterType("PRIVATE")} className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border flex items-center gap-1 ${filterType === 'PRIVATE' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}><UserCircle2 size={12} /> Da Privati</button>
              <button onClick={() => setFilterType("ORGANIZER")} className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border flex items-center gap-1 ${filterType === 'ORGANIZER' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}`}><Building2 size={12} /> Da Strutture</button>
            </div>

            {isMapView && coords ? (
              <div className="h-[400px] w-full relative">
                <MapWrapper events={filteredEvents} center={coords} radius={radius} />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500 text-sm font-medium mb-4">Nessun evento in zona per questa categoria.</p>
                <Link href="/events/new" className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 active:scale-95 transition-transform">
                  <Plus size={18} /> Creane uno tu!
                </Link>
              </div>
            ) : (
              <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x pr-8">
                {filteredEvents.map(event => renderEventCard(event, false))}
              </div>
            )}
          </section>



        </div>
      )}
    </div>
  );
}
