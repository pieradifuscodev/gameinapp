"use client";

import { useEffect, useState } from "react";
import { MapPin, AlertCircle, Plus, TrendingUp, Navigation, RefreshCw } from "lucide-react";
import Link from "next/link";
import MapWrapper from "@/components/ui/MapWrapper";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import PrivateEventCard from "@/components/events/PrivateEventCard";
import PromotedEventCard from "@/components/events/PromotedEventCard";
import TournamentAdCards from "@/components/events/TournamentAdCards";
import HomeHeader from "@/components/home/HomeHeader";
import FilterModal from "@/components/home/FilterModal";
import MapToggleButton from "@/components/home/MapToggleButton";

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

type GymData = {
  id: string;
  name: string;
  address: string;
  distanceInKm: number;
};

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [radius, setRadius] = useState(20);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PRIVATE" | "ORGANIZER">("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { coords, source: geoSource, loading: geoLoading, error: geoError, retry: retryGeo } = useGeolocation();

  const loading = geoLoading || fetchLoading;
  const error = geoError ?? fetchError;

  const hour = new Date().getHours();
  let greeting = "Bentornato!";
  if (hour < 12) greeting = "Buongiorno!";
  else if (hour < 18) greeting = "Buon pomeriggio!";
  else greeting = "Buonasera!";

  useEffect(() => {
    if (!coords) return;
    const fetchEvents = async () => {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const sportQuery = selectedSport ? `&sport=${selectedSport}` : "";
        const res = await fetch(`/api/events/search?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}${sportQuery}`);
        if (!res.ok) throw new Error("Errore durante la ricerca degli eventi");
        const data = await res.json();
        setEvents(data.events || []);
        setGyms(data.gyms || []);
      } catch (err: any) {
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchEvents();
  }, [coords, radius, selectedSport]);

  const promotedEvents = events.filter(e => e.creator.role === "ORGANIZER").slice(0, 5);

  let filteredEvents = events;
  if (filterType === "PRIVATE") filteredEvents = events.filter(e => e.creator.role !== "ORGANIZER");
  if (filterType === "ORGANIZER") filteredEvents = events.filter(e => e.creator.role === "ORGANIZER");
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(q) || e.gym.name.toLowerCase().includes(q));
  }

  const renderEventCard = (event: EventData, isBanner = false) => {
    if (event.creator.role !== "ORGANIZER") {
      return <PrivateEventCard key={event.id} event={event} />;
    }
    return <PromotedEventCard key={event.id} event={event} isBanner={isBanner} />;
  };

  return (
    <div className="flex flex-col bg-white flex-1 relative">
      <HomeHeader 
        greeting={greeting}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasFilters={filterType !== 'ALL' || selectedSport !== null}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[40vh] text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-slate-900 mb-4" />
          <p className="font-bold text-sm">Ricerca in corso...</p>
        </div>
      ) : error ? (
        <div className="mx-4 my-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[13px] flex flex-col gap-3">
          <div className="flex gap-2 items-start">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          {geoError && (
            <button onClick={retryGeo} className="flex items-center justify-center gap-1.5 self-start text-xs font-bold text-red-700 bg-red-100 active:bg-red-200 px-3 py-1.5 rounded-lg transition-colors">
              <RefreshCw size={12} /> Riprova
            </button>
          )}
        </div>
      ) : isMapView ? (
        <div className="flex-1 relative min-h-[50vh]">
          {coords ? (
            <div className="absolute inset-0">
              <MapWrapper events={filteredEvents} center={coords} radius={radius} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">Posizione non disponibile</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8 pt-4 pb-[120px]">
          
          {/* Promozioni (Strutture) */}
          {!searchQuery && promotedEvents.length > 0 && (
            <section>
              <div className="mb-2 px-4 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-amber-500" />
                <h2 className="font-bold text-slate-900 text-[17px]">In Evidenza</h2>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x px-4 scroll-px-4">
                {promotedEvents.map(event => renderEventCard(event, true))}
                <div className="shrink-0 w-2" aria-hidden />
              </div>
            </section>
          )}

          {/* Eventi in zona */}
          <section>
            <div className="mb-2 px-4 flex justify-between items-end">
              <div>
                <h2 className="font-bold text-slate-900 text-[17px]">Eventi in Zona</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-700 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    <MapPin size={10} /> Entro {radius} km
                  </div>
                </div>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="mx-4 p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center mt-2">
                <p className="text-slate-500 text-sm font-medium mb-4">Nessun evento in zona per questa categoria.</p>
                <Link href="/events/new" className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-2 active:bg-slate-800 transition-colors">
                  <Plus size={16} /> Creane uno tu!
                </Link>
              </div>
            ) : (
              <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x px-4 scroll-px-4">
                {filteredEvents.map(event => renderEventCard(event, false))}
                <div className="shrink-0 w-2" aria-hidden />
              </div>
            )}
          </section>

          {/* Tornei in evidenza */}
          {!searchQuery && <TournamentAdCards />}
        </div>
      )}

      {isFilterOpen && (
        <FilterModal 
          onClose={() => setIsFilterOpen(false)}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          radius={radius}
          setRadius={setRadius}
          filterType={filterType}
          setFilterType={setFilterType}
        />
      )}

      <MapToggleButton isMapView={isMapView} onToggle={() => setIsMapView(!isMapView)} />
    </div>
  );
}
