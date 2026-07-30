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
import { FollowingFeed } from "@/components/home/FollowingFeed";
import SkeletonEventCard from "@/components/ui/SkeletonEventCard";

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
  const [activeTab, setActiveTab] = useState<"EXPLORE" | "FOLLOWING">("EXPLORE");
  const [events, setEvents] = useState<EventData[]>([]);
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [radius, setRadius] = useState(20);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PRIVATE" | "ORGANIZER">("ALL");
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "TOMORROW" | "WEEK">("ALL");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "MORNING" | "AFTERNOON" | "EVENING">("ALL");
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
        const res = await fetch(`/api/events/search?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}${sportQuery}&date=${dateFilter}&time=${timeFilter}`);
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
  }, [coords, radius, selectedSport, dateFilter, timeFilter]);

  const promotedEvents = events.filter(e => e.creator.role === "STRUTTURA" || e.creator.role === "ORGANIZER").slice(0, 5);

  let filteredEvents = events;
  if (filterType === "PRIVATE") filteredEvents = events.filter(e => e.creator.role !== "STRUTTURA" && e.creator.role !== "ORGANIZER");
  if (filterType === "ORGANIZER") filteredEvents = events.filter(e => e.creator.role === "STRUTTURA" || e.creator.role === "ORGANIZER");
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(q) || e.gym.name.toLowerCase().includes(q));
  }

  const renderEventCard = (event: EventData, isBanner = false) => {
    if (event.creator.role !== "STRUTTURA" && event.creator.role !== "ORGANIZER") {
      return <PrivateEventCard key={event.id} event={event} />;
    }
    return <PromotedEventCard key={event.id} event={event} isBanner={isBanner} />;
  };

  return (
    <div className="flex flex-col flex-1 relative bg-[#0C0C0E] w-full">
      <HomeHeader 
        greeting={greeting}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasFilters={filterType !== 'ALL' || selectedSport !== null || dateFilter !== 'ALL' || timeFilter !== 'ALL'}
        onOpenFilter={() => setIsFilterOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />



      {activeTab === "FOLLOWING" ? (
        <FollowingFeed coords={coords} />
      ) : loading ? (
        <div className="flex flex-col gap-8 pt-28 pb-24">
          <section>
            <div className="mb-2 px-4 flex items-center gap-2">
              <div className="h-6 w-32 bg-[#16161A] rounded animate-pulse"></div>
            </div>
            <div className="flex overflow-x-hidden gap-3 pb-2 px-4">
              <SkeletonEventCard />
              <SkeletonEventCard />
              <SkeletonEventCard />
            </div>
          </section>
          <section>
            <div className="mb-2 px-4 flex items-center gap-2">
              <div className="h-6 w-40 bg-[#16161A] rounded animate-pulse"></div>
            </div>
            <div className="flex overflow-x-hidden gap-3 pb-2 px-4">
              <SkeletonEventCard />
              <SkeletonEventCard />
              <SkeletonEventCard />
            </div>
          </section>
        </div>
      ) : error ? (
        <div className="mx-4 my-4 p-4 bg-[#16161A] text-red-500 rounded-xl border border-red-500/20 text-[13px] flex flex-col gap-3">
          <div className="flex gap-2 items-start">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          {geoError && (
            <button onClick={retryGeo} className="flex items-center justify-center gap-1.5 self-start text-xs font-black text-black bg-[#CCFF00] px-4 py-2 rounded-[24px] transition-colors">
              <RefreshCw size={12} /> Riprova
            </button>
          )}
        </div>
      ) : isMapView ? (
        <div className="w-full h-[calc(100dvh-230px)] min-h-[400px] relative">
          {coords ? (
            <div className="absolute inset-x-0 bottom-0 top-[110px] w-full">
              <MapWrapper events={filteredEvents} center={coords} radius={radius} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-medium pt-28">Posizione non disponibile</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8 pt-28 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Promozioni (Strutture) */}
          {!searchQuery && promotedEvents.length > 0 && (
            <section>
              <div className="mb-3 px-4 flex items-center gap-1.5">
                <TrendingUp size={18} className="text-[#CCFF00]" />
                <h2 className="font-black text-white text-[19px] tracking-tight">In Evidenza</h2>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x px-4 scroll-px-4">
                {promotedEvents.map(event => renderEventCard(event, true))}
                <div className="shrink-0 w-2" aria-hidden />
              </div>
            </section>
          )}

          {/* Eventi in zona */}
          <section>
            <div className="mb-3 px-4 flex justify-between items-center">
              <div>
                <h2 className="font-black text-white text-[19px] tracking-tight">Eventi in Zona</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-[#8E8E93] font-bold bg-[#16161A] border border-[#222226] px-2 py-0.5 rounded-md">
                    <MapPin size={10} /> Entro {radius} km
                  </div>
                </div>
              </div>
              <Link href="/categories" className="text-xs font-black uppercase tracking-wider text-[#CCFF00] hover:underline">
                Vedi Tutti
              </Link>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="mx-4 p-8 bg-[#16161A] rounded-[12px] border border-[#222226] text-center mt-2">
                <p className="text-[#8E8E93] text-sm font-medium mb-4">Nessun evento in zona per questa categoria.</p>
                <Link href="/events/new" className="bg-[#CCFF00] text-black font-black px-6 py-3 rounded-[24px] shadow-sm inline-flex items-center gap-2 active:bg-[#a6d100] transition-colors">
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
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />
      )}

      <MapToggleButton isMapView={isMapView} onToggle={() => setIsMapView(!isMapView)} />
    </div>
  );
}
