"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, User, Activity, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";

import { SPORTS } from "@/lib/sports";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ruolo
  const [role, setRole] = useState<"SPORTIVO" | "ORGANIZZATORE">("SPORTIVO");

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
  
  const isOrganizer = role === "ORGANIZZATORE";

  // Pre-fill se i dati esistono già nella sessione
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
    if (!name || !surname || !username) {
      setError("Nome, Cognome e Username sono obbligatori.");
      return;
    }
    
    if (isOrganizer && (!companyName || !vatNumber)) {
      setError("Nome Struttura e Partita IVA sono obbligatori per gli Organizzatori.");
      return;
    }

    if (!isOrganizer && favoriteSports.length === 0) {
      setError("Seleziona almeno uno sport.");
      return;
    }

    if (!latitude || !longitude) {
      setError("Rileva la tua posizione per trovare eventi vicini a te.");
      return;
    }

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
    <div className="h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0060FD 0%, #003db3 100%)" }}>
      <div className="text-white font-bold animate-pulse">Caricamento...</div>
    </div>
  );

  return (
    <div 
      className="flex flex-col h-full relative pb-safe overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0060FD 0%, #003db3 100%)" }}
    >
      {/* Blob Sfondo */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full animate-blob pointer-events-none"
        style={{ background: "rgba(255,255,255,0.18)", filter: "blur(40px)" }}
      />
      <div
        className="absolute top-1/3 -right-16 w-72 h-72 rounded-full animate-blob animation-delay-2000 pointer-events-none"
        style={{ background: "rgba(255,255,255,0.13)", filter: "blur(50px)" }}
      />
      <div
        className="absolute -bottom-16 left-1/4 w-56 h-56 rounded-full animate-blob animation-delay-4000 pointer-events-none"
        style={{ background: "rgba(100,180,255,0.2)", filter: "blur(40px)" }}
      />

      <div className="flex-1 px-5 pt-10 pb-6 z-10 overflow-y-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30">
            <img src="/assets/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">Completa il Profilo</h1>
            <p className="text-white/75 text-xs font-medium mt-0.5">
              {step === 1 ? "Scegli come vuoi usare l'app" : (isOrganizer ? "Dati aziendali e della struttura" : "Raccontaci di te e dei tuoi sport")}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-white' : 'bg-white/25'
            }`} />
          ))}
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/25 p-5 shadow-2xl flex flex-col flex-1 min-h-[400px]">
          {error && (
            <div className="bg-red-500/20 text-white p-3 rounded-xl flex gap-2 items-center mb-4 border border-red-300/30 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* STEP 1: Ruolo */}
          {step === 1 && (
            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-sm font-bold text-white/90 mb-2 flex items-center gap-2 uppercase tracking-wide">
                Seleziona Ruolo
              </h2>

              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => setRole("SPORTIVO")}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                    role === "SPORTIVO" 
                    ? "border-white bg-white/20 shadow-sm" 
                    : "border-white/20 hover:border-white/40 bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-full ${role === "SPORTIVO" ? "bg-white text-[#0060FD]" : "bg-white/20 text-white/60"}`}>
                      <Activity size={20} />
                    </div>
                    <h3 className={`font-black ${role === "SPORTIVO" ? "text-white" : "text-white/70"}`}>Sportivo</h3>
                  </div>
                  <p className="text-xs text-white/60 font-medium pl-12 leading-relaxed">
                    Trova eventi, prenota campi, conosci nuove persone e organizza partite con gli amici.
                  </p>
                </div>

                <div 
                  onClick={() => setRole("ORGANIZZATORE")}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                    role === "ORGANIZZATORE" 
                    ? "border-white bg-white/20 shadow-sm" 
                    : "border-white/20 hover:border-white/40 bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-full ${role === "ORGANIZZATORE" ? "bg-white text-[#0060FD]" : "bg-white/20 text-white/60"}`}>
                      <Building2 size={20} />
                    </div>
                    <h3 className={`font-black ${role === "ORGANIZZATORE" ? "text-white" : "text-white/70"}`}>Organizzatore</h3>
                  </div>
                  <p className="text-xs text-white/60 font-medium pl-12 leading-relaxed">
                    Aggiungi la tua struttura sportiva, ricevi prenotazioni e gestisci i tuoi campi.
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 flex justify-end">
                <button 
                  onClick={() => { setError(""); setStep(2); }}
                  className="w-full py-3.5 rounded-xl bg-white text-[#0060FD] font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
                >
                  Avanti
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dati Base Condivisi */}
          {step === 2 && (
            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-sm font-bold text-white/90 mb-2 flex items-center gap-2 uppercase tracking-wide">
                <User size={16} className="text-white/80" /> Chi sei?
              </h2>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-white/80 mb-1">Nome *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-white/80 mb-1">Cognome *</label>
                  <input type="text" value={surname} onChange={e => setSurname(e.target.value)} className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Username (univoco) *</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
              </div>
              
              <div className="flex flex-col items-center mb-4">
                <label className="block text-xs font-semibold text-white/80 mb-2">Foto Profilo / Logo (opzionale)</label>
                <ImageUpload value={avatar} onChange={setAvatar} />
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                <button onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-white/20 text-white rounded-xl font-bold text-sm active:scale-[0.98] border border-white/25">
                  Indietro
                </button>
                <button 
                  onClick={() => {
                    if(!name || !surname || !username) setError("Nome, cognome e username richiesti.");
                    else { setError(""); setStep(3); }
                  }}
                  className="w-2/3 py-3.5 rounded-xl bg-white text-[#0060FD] font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
                >
                  Avanti
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dati Specifici (Sportivo vs Organizzatore) */}
          {step === 3 && (
            <div className="flex flex-col gap-4 flex-1">
              {isOrganizer ? (
                <>
                  <h2 className="text-sm font-bold text-white/90 mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <Building2 size={16} className="text-white/80" /> Dati Aziendali
                  </h2>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Nome Struttura o Società *</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Partita IVA *</label>
                    <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-sm font-bold text-white/90 mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <Activity size={16} className="text-white/80" /> I tuoi Sport
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {SPORTS.map(sport => {
                      const isSelected = favoriteSports.includes(sport.id);
                      return (
                        <button
                          key={sport.id}
                          onClick={() => toggleSport(sport.id)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all active:scale-95 border
                            ${isSelected 
                              ? `${sport.pillColor} ${sport.pillText} border-transparent shadow-md` 
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm"}`}
                        >
                          <span className="text-xl">{sport.icon}</span>
                          <span>{sport.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="mt-auto pt-4 flex gap-2">
                <button onClick={() => setStep(2)} className="w-1/3 py-3.5 bg-white/20 text-white rounded-xl font-bold text-sm active:scale-[0.98] border border-white/25">
                  Indietro
                </button>
                <button 
                  onClick={() => {
                    if(isOrganizer && (!companyName || !vatNumber)) setError("Compila i dati aziendali.");
                    else if (!isOrganizer && favoriteSports.length === 0) setError("Seleziona almeno uno sport.");
                    else { setError(""); setStep(4); }
                  }}
                  className="w-2/3 py-3.5 rounded-xl bg-white text-[#0060FD] font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
                >
                  Avanti
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Posizione */}
          {step === 4 && (
            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-sm font-bold text-white/90 mb-2 flex items-center gap-2 uppercase tracking-wide">
                <MapPin size={16} className="text-white/80" /> Posizione
              </h2>
              
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center flex flex-col items-center">
                <MapPin size={32} className="text-white/60 mb-2" />
                <p className="text-sm text-white/80 mb-4 font-medium">
                  {isOrganizer 
                    ? "Dove si trova la tua struttura sportiva?" 
                    : "Imposta la tua posizione per trovare partite vicino a te."}
                </p>
                <button 
                  onClick={getGPS}
                  className="px-4 py-2 bg-white text-[#0060FD] font-bold rounded-lg text-sm active:scale-95 transition-transform shadow-sm"
                >
                  {loading ? "Rilevamento..." : "Rileva Posizione GPS"}
                </button>
              </div>

              {latitude && longitude && (
                <div className="bg-white/20 border border-white/30 p-3 rounded-xl flex items-center gap-2 text-white">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-bold">Posizione rilevata con successo!</span>
                </div>
              )}

              <div className="mt-auto pt-4 flex gap-2">
                <button onClick={() => setStep(3)} className="w-1/3 py-3.5 bg-white/20 text-white rounded-xl font-bold text-sm active:scale-[0.98] border border-white/25">
                  Indietro
                </button>
                <button 
                  onClick={handleComplete}
                  disabled={loading || !latitude}
                  className={`w-2/3 py-3.5 rounded-xl bg-white text-[#0060FD] font-bold text-sm shadow-md active:scale-[0.98] transition-transform ${
                    !latitude ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? "Salvataggio..." : "Completa Profilo"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
