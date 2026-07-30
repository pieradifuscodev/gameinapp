"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventInput } from "@/lib/validations/event";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, AlertCircle, Calendar, Banknote } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { SportSelector } from "@/components/events/forms/SportSelector";
import { LocationSearch } from "@/components/events/forms/LocationSearch";
import { PlayerCounter } from "@/components/events/forms/PlayerCounter";
import { PrivacySettings } from "@/components/events/forms/PrivacySettings";
import { EventPreferences } from "@/components/events/forms/EventPreferences";

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
  eventId?: string;
  initialData?: any;
}

export default function EventForm({ userRole, circles, gyms, eventId, initialData }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isOrganizer = userRole === "STRUTTURA";

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: initialData || {
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
  const sport = watch("sport");
  const location = watch("location");
  const circleId = watch("circleId") || "";

  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 2);
  const minDateString = minDate.toISOString().slice(0, 16);

  const onSubmit = async (data: CreateEventInput) => {
    setLoading(true);
    setErrorMsg("");
    
    // Pulizia campi
    if (!data.isPrivate) {
      data.circleId = null;
    }
    
    try {
      const endpoint = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || `Errore durante ${eventId ? "l'aggiornamento" : "la creazione"} dell'evento`);
      }
      
      toast.success(eventId ? "Evento modificato con successo!" : "Evento creato con successo!");

      // Redirect alla pagina dell'evento o dashboard
      if (eventId) {
        router.push(`/events/${eventId}`);
      } else {
        router.push(`/dashboard`);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-[#0C0C0E] text-white relative pb-safe">
      <div className="flex-1 p-4 pb-32 overflow-y-auto flex flex-col gap-6">
        
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Titolo */}
        <div>
          <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Titolo Evento *</label>
          <input 
            type="text" 
            {...register("title")}
            placeholder="es. Partita di calcetto serale"
            className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-accent shadow-sm"
            style={{ WebkitBoxShadow: 'none' }}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.title.message}</p>}
        </div>

        {/* Sport (Componente Estratto) */}
        <SportSelector 
          value={sport} 
          onChange={(s) => setValue("sport", s, { shouldValidate: true })} 
          error={errors.sport?.message} 
          isOrganizer={isOrganizer}
        />

        {/* Data e Ora */}
        <div>
          <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
            <Calendar size={14} style={{ color: accentColor }} /> Data e Ora *
          </label>
          <input 
            type="datetime-local" 
            min={minDateString}
            {...register("dateStart")}
            className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-accent shadow-sm"
          />
          {errors.dateStart && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.dateStart.message}</p>}
        </div>

        {/* Luogo (Componente Estratto) */}
        <LocationSearch 
          gyms={gyms}
          locationValue={location || ""}
          onLocationSelect={(loc, lat, lng, gymId) => {
            setValue("location", loc, { shouldValidate: true });
            setValue("latitude", lat);
            setValue("longitude", lng);
            setValue("gymId", gymId);
          }}
          error={errors.location?.message}
          isOrganizer={isOrganizer}
        />

        {/* Giocatori (Componente Estratto) */}
        <PlayerCounter 
          value={maxPlayers}
          onChange={(val) => setValue("maxPlayers", val, { shouldValidate: true })}
          error={errors.maxPlayers?.message}
          isOrganizer={isOrganizer}
        />

        {/* Visibilità (Componente Estratto) */}
        <PrivacySettings 
          isPrivate={isPrivate}
          onPrivacyChange={(priv) => setValue("isPrivate", priv)}
          circles={circles}
          circleId={circleId}
          onCircleChange={(cid) => setValue("circleId", cid, { shouldValidate: true })}
          circleError={errors.circleId?.message}
          isOrganizer={isOrganizer}
        />

        {/* Quota di Partecipazione */}
        <div className="bg-[#16161A] p-4 rounded-xl border border-[#222226] shadow-sm">
          <h3 className="font-black text-white mb-3 flex items-center gap-1.5 uppercase tracking-wide text-xs">
            <Banknote size={16} style={{ color: accentColor }} /> Quota di partecipazione
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] font-bold">€</span>
              <input 
                type="number" 
                step="0.50"
                min="0"
                {...register("price", { valueAsNumber: true, setValueAs: v => v === "" ? null : parseFloat(v) })}
                placeholder="0.00"
                className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl pl-8 pr-4 py-3.5 text-sm font-bold text-white outline-none focus:border-accent"
              />
            </div>
            <div className="text-[11px] text-[#8E8E93] font-bold whitespace-nowrap">
              Lascia 0 o vuoto se gratis
            </div>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.price.message}</p>}
        </div>

        {/* Preferenze (Componente Estratto) */}
        <EventPreferences 
          skillLevel={watch("skillLevel") ?? null}
          onSkillLevelChange={(val) => setValue("skillLevel", val)}
          genderPreference={watch("genderPreference") ?? null}
          onGenderPreferenceChange={(val) => setValue("genderPreference", val)}
          isOrganizer={isOrganizer}
        />

        {/* Descrizione */}
        <div>
          <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Descrizione (Opzionale)</label>
          <textarea 
            {...register("description")}
            rows={3}
            placeholder="Informazioni aggiuntive (es. portare palloni, quota campo...)"
            className="w-full bg-[#16161A] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-accent shadow-sm resize-none"
          />
        </div>

      </div>

      {/* Tasto Submit (Sticky in basso) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0C0C0E]/90 border-t border-[#222226] backdrop-blur-md z-20">
        <button
          type="submit"
          disabled={loading || (isPrivate && circles.length === 0)}
          className="w-full text-black font-black uppercase tracking-wider py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
          style={{ backgroundColor: accentColor }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <><Save size={18} /> {eventId ? "Salva Modifiche" : "Crea Evento"}</>
          )}
        </button>
      </div>
    </form>
  );
}
