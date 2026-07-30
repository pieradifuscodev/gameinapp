"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleSelectionStep } from "@/components/onboarding/RoleSelectionStep";
import { BasicDataStep } from "@/components/onboarding/BasicDataStep";
import { SpecificDataStep } from "@/components/onboarding/SpecificDataStep";
import { LocationStep } from "@/components/onboarding/LocationStep";

export function OnboardingForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ruolo
  const [role, setRole] = useState<"SPORTIVO" | "STRUTTURA">("SPORTIVO");

  // Dati Base
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // Dati Sportivo
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  
  // Dati Organizzatore
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  // Dati Posizione (Condivisi)
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  const isOrganizer = role === "STRUTTURA";

  // Pre-fill
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      if (u.role) setRole(u.role);
      if (u.name) setName(u.name);
      if (u.surname) setSurname(u.surname);
      if (u.username) setUsername(u.username);
      if (u.avatar) setAvatar(u.avatar);
      if (u.favoriteSports) setFavoriteSports(u.favoriteSports);
      if (u.companyName) setCompanyName(u.companyName);
      if (u.vatNumber) setVatNumber(u.vatNumber);
      if (u.latitude) setLatitude(u.latitude);
      if (u.longitude) setLongitude(u.longitude);
    }
  }, [session]);

  const toggleSport = (sport: string) => {
    setFavoriteSports(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const getGPS = () => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal tuo browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLoading(false);
      },
      (err) => {
        setError("Devi consentire l'accesso alla posizione per continuare.");
        setLoading(false);
      }
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name, surname, username, avatar,
          favoriteSports,
          companyName, vatNumber,
          latitude, longitude
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante il salvataggio.");

      await update({
        role,
        name, surname, username, avatar,
        favoriteSports, companyName, vatNumber,
        latitude, longitude
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return (
    <div className="h-screen flex items-center justify-center bg-[#0C0C0E]">
      <div className="text-[#8E8E93] font-black uppercase tracking-wider text-xs animate-pulse">Caricamento...</div>
    </div>
  );

  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="flex flex-col h-full relative pb-safe overflow-hidden bg-[#0C0C0E]">
      <div className="flex-1 px-5 pt-10 pb-6 z-10 overflow-y-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#16161A] p-2.5 rounded-xl border border-[#222226]">
            <img src="/assets/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">Completa il Profilo</h1>
            <p className="text-[#8E8E93] text-xs font-bold mt-0.5">
              {step === 1 ? "Scegli come vuoi usare l'app" : (isOrganizer ? "Dati aziendali e della struttura" : "Raccontaci di te e dei tuoi sport")}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-2">
          {[1,2,3,4].map(s => (
            <div 
              key={s} 
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: s <= step ? accentColor : '#222226' }}
            />
          ))}
        </div>

        {/* Minimal Card */}
        <div className="bg-[#16161A] rounded-2xl border border-[#222226] p-5 shadow-2xl flex flex-col flex-1 min-h-[400px]">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl mb-4 border border-red-500/20 text-xs font-semibold">
              {error}
            </div>
          )}

          {step === 1 && (
            <RoleSelectionStep 
              role={role} 
              setRole={setRole} 
              onNext={() => { setError(""); setStep(2); }} 
            />
          )}

          {step === 2 && (
            <BasicDataStep 
              name={name} setName={setName}
              surname={surname} setSurname={setSurname}
              username={username} setUsername={setUsername}
              avatar={avatar} setAvatar={setAvatar}
              onBack={() => setStep(1)}
              onNext={() => {
                if(!name || !surname || !username) setError("Nome, cognome e username richiesti.");
                else { setError(""); setStep(3); }
              }}
              isOrganizer={isOrganizer}
            />
          )}

          {step === 3 && (
            <SpecificDataStep 
              isOrganizer={isOrganizer}
              companyName={companyName} setCompanyName={setCompanyName}
              vatNumber={vatNumber} setVatNumber={setVatNumber}
              favoriteSports={favoriteSports} toggleSport={toggleSport}
              onBack={() => setStep(2)}
              onNext={() => {
                if(isOrganizer && (!companyName || !vatNumber)) setError("Compila i dati aziendali.");
                else if (!isOrganizer && favoriteSports.length === 0) setError("Seleziona almeno uno sport.");
                else { setError(""); setStep(4); }
              }}
            />
          )}

          {step === 4 && (
            <LocationStep 
              isOrganizer={isOrganizer}
              latitude={latitude} longitude={longitude}
              loading={loading} getGPS={getGPS}
              onBack={() => setStep(3)}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
