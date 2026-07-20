"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventInput } from "@/lib/validations/event";
import { SPORTS } from "@/lib/sports";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, AlertCircle, Plus, Minus, MapPin, Users, Calendar, Info, ChevronDown, MapPinIcon } from "lucide-react";
import Link from "next/link";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

const libraries: any = ["places"];

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Circle {
  id: string;
  name: string;
}

interface EventFormProps {
  userRole: string;
  circles: Circle[];
  gyms: Gym[];
}

export default function EventForm({ userRole, circles, gyms }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [circleDropdownOpen, setCircleDropdownOpen] = useState(false);

  const isOrganizer = userRole === "ORGANIZZATORE";

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      sport: "",
      dateStart: "",
      description: "",
      isPrivate: false,
      circleId: "",
      gymId: "",
      location: "",
      latitude: 0,
      longitude: 0,
      maxPlayers: 4
    }
  });

  const isPrivate = watch("isPrivate");
  const maxPlayers = watch("maxPlayers");
  const locationWatch = watch("location");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const {
    ready,
    value: searchValue,
    suggestions: { status, data: placesData },
    setValue: setSearchValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "it" },
    },
    debounce: 300,
    initOnMount: false,
  });

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const filteredGyms = searchValue ? gyms.filter(g => 
    g.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    g.address.toLowerCase().includes(searchValue.toLowerCase())
  ) : [];

  const onSubmit = async (data: CreateEventInput) => {
    setLoading(true);
    setErrorMsg("");
    
    // Pulizia campi
    if (!data.isPrivate) {
      data.circleId = null;
    }
    
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Errore durante la creazione dell'evento");
      }
      
      // Redirect alla pagina del nuovo evento o alla dashboard
      router.push(`/dashboard`);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-slate-50 relative pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Crea Evento</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-4 pb-32 overflow-y-auto flex flex-col gap-6">
        
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Titolo */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Titolo Evento *</label>
          <input 
            type="text" 
            {...register("title")}
            placeholder="es. Partita di calcetto serale"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/80 shadow-sm"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
        </div>

        {/* Sport (Custom Combobox) */}
        <div className="relative">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Sport *</label>
          <div 
            onClick={() => setSportDropdownOpen(!sportDropdownOpen)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none shadow-sm flex items-center justify-between cursor-pointer"
          >
            {watch("sport") ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">{SPORTS.find(s => s.id === watch("sport"))?.icon}</span> 
                {SPORTS.find(s => s.id === watch("sport"))?.label}
              </span>
            ) : (
              <span className="text-gray-400">Seleziona uno sport...</span>
            )}
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${sportDropdownOpen ? "rotate-180" : ""}`} />
          </div>
          
          {sportDropdownOpen && (
            <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {SPORTS.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => {
                    setValue("sport", s.id, { shouldValidate: true });
                    setSportDropdownOpen(false);
                  }}
                  className={`px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${watch("sport") === s.id ? "bg-primary/10 text-primary font-bold" : "text-gray-700"}`}
                >
                  <span className="text-lg">{s.icon}</span> <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
          {errors.sport && <p className="text-red-500 text-xs mt-1.5">{errors.sport.message}</p>}
        </div>

        {/* Data e Ora */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Calendar size={16} className="text-gray-400" /> Data e Ora *
          </label>
          <input 
            type="datetime-local" 
            {...register("dateStart")}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/80 shadow-sm"
          />
          {errors.dateStart && <p className="text-red-500 text-xs mt-1.5">{errors.dateStart.message}</p>}
        </div>

        {/* Luogo / Struttura con Google Maps */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <MapPin size={18} className="text-primary/80" /> Luogo dell'incontro
          </h3>
          
          <div className="relative">
            <input 
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setLocationDropdownOpen(true);
                // Resetta se l'utente inizia a scrivere qualcos'altro
                setValue("location", e.target.value);
                setValue("gymId", "");
              }}
              onFocus={() => setLocationDropdownOpen(true)}
              disabled={!ready}
              placeholder={isLoaded ? "Cerca indirizzo o struttura..." : "Caricamento mappa..."}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/80"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location.message}</p>}
            
            {locationDropdownOpen && (searchValue.length > 1) && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {/* Nostre Strutture */}
                {filteredGyms.length > 0 && (
                  <div className="bg-primary/10/50">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-blue-800 uppercase tracking-wider border-b border-primary/20">Strutture Registrate</div>
                    {filteredGyms.map(g => (
                      <div 
                        key={g.id} 
                        onClick={() => {
                          setValue("gymId", g.id, { shouldValidate: true });
                          setValue("location", g.address, { shouldValidate: true });
                          setValue("latitude", g.latitude);
                          setValue("longitude", g.longitude);
                          setSearchValue(g.name);
                          clearSuggestions();
                          setLocationDropdownOpen(false);
                        }}
                        className="px-3 py-2.5 text-sm cursor-pointer hover:bg-primary/10 flex items-start gap-2 border-b border-primary/10/50 last:border-0"
                      >
                        <MapPinIcon size={16} className="text-primary/80 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">{g.name}</div>
                          <div className="text-xs text-gray-500 truncate">{g.address}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Google Places */}
                {status === "OK" && (
                  <div>
                    {filteredGyms.length > 0 && <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100">Altri Luoghi (Google Maps)</div>}
                    {placesData.map(({ place_id, description }) => (
                      <div 
                        key={place_id} 
                        onClick={async () => {
                          setSearchValue(description, false);
                          clearSuggestions();
                          setLocationDropdownOpen(false);
                          try {
                            const results = await getGeocode({ address: description });
                            const { lat, lng } = await getLatLng(results[0]);
                            setValue("location", description, { shouldValidate: true });
                            setValue("latitude", lat);
                            setValue("longitude", lng);
                            setValue("gymId", "");
                          } catch (error) {
                            console.error("Errore Geocoding: ", error);
                          }
                        }}
                        className="px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex items-start gap-2 border-b border-gray-50 last:border-0"
                      >
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Riepilogo selezione */}
            {locationWatch && !locationDropdownOpen && (
              <div className="mt-2 text-xs text-primary flex items-center gap-1 font-medium bg-primary/10 p-2 rounded-md">
                <MapPin size={14} /> Luogo confermato
              </div>
            )}
          </div>
        </div>

        {/* Giocatori */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Users size={18} className="text-primary/80" /> Giocatori
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Totale partecipanti richiesti</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setValue("maxPlayers", Math.max(2, maxPlayers - 1))}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <Minus size={16} className="text-gray-600" />
            </button>
            <span className="text-lg font-black w-6 text-center">{maxPlayers}</span>
            <button 
              type="button" 
              onClick={() => setValue("maxPlayers", Math.min(30, maxPlayers + 1))}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          <input type="hidden" {...register("maxPlayers")} />
          {errors.maxPlayers && <p className="text-red-500 text-xs mt-1.5">{errors.maxPlayers.message}</p>}
        </div>

        {/* Visibilità (Pubblico/Privato) */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Evento Privato</h3>
              <p className="text-xs text-gray-500 mt-0.5">Visibile solo alla tua cerchia</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register("isPrivate")} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {isPrivate && (
            <div className="mt-2 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seleziona Cerchia *</label>
              {circles.length > 0 ? (
                <div className="relative">
                  <div 
                    onClick={() => setCircleDropdownOpen(!circleDropdownOpen)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none flex items-center justify-between cursor-pointer"
                  >
                    {watch("circleId") ? (
                      <span className="text-gray-900 truncate">
                        {circles.find(c => c.id === watch("circleId"))?.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Seleziona una cerchia...</span>
                    )}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${circleDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                  
                  {circleDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {circles.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => {
                            setValue("circleId", c.id, { shouldValidate: true });
                            setCircleDropdownOpen(false);
                          }}
                          className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0 truncate ${watch("circleId") === c.id ? "bg-primary/10 text-primary font-bold" : "text-gray-700"}`}
                        >
                          {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex flex-col gap-2 border border-amber-200">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Info size={16} /> Nessuna cerchia trovata
                  </div>
                  <p className="text-xs">Devi appartenere o aver creato almeno una cerchia per organizzare eventi privati.</p>
                  <Link href="/circles/new" className="text-primary font-bold text-xs mt-1 underline">Crea Cerchia</Link>
                </div>
              )}
              {errors.circleId && <p className="text-red-500 text-xs mt-1.5">{errors.circleId.message}</p>}
            </div>
          )}
        </div>

        {/* Descrizione */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Descrizione (Opzionale)</label>
          <textarea 
            {...register("description")}
            rows={3}
            placeholder="Informazioni aggiuntive (es. portare palloni, quota campo...)"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/80 shadow-sm resize-none"
          />
        </div>

      </div>

      {/* Tasto Submit (Sticky in basso) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-20">
        <button
          type="submit"
          disabled={loading || (isPrivate && circles.length === 0)}
          className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><Save size={20} /> Crea Evento</>
          )}
        </button>
      </div>
    </form>
  );
}
