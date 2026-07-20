"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ChevronLeft, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PreferencesPage() {
  const { data: session, update } = useSession();
  const [maxNotificationDist, setMaxNotificationDist] = useState(20);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setMaxNotificationDist(u.maxNotificationDist || 20);
    }
  }, [session]);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxNotificationDist }),
      });
      if (!res.ok) throw new Error("Errore durante l'aggiornamento");
      await update({ maxNotificationDist });
      setMessage({ type: 'success', text: "Preferenze aggiornate!" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGPS = () => {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: "Geolocalizzazione non supportata." });
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          });
          if (!res.ok) throw new Error("Errore salvataggio GPS");
          await update({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setMessage({ type: 'success', text: "Posizione GPS aggiornata!" });
        } catch (err: any) {
          setMessage({ type: 'error', text: err.message });
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMessage({ type: 'error', text: "Permesso GPS negato o errore." });
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-safe">
      <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Preferenze</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        {message && (
          <div className={`p-4 mb-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-primary/10 text-primary border-primary/20'
          }`}>
            {message.type === 'error' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <MapPin size={16} className="text-primary" /> Posizione e Raggio
          </h2>
          
          <div className="mb-6">
            <label className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
              <span>Distanza massima eventi</span>
              <span className="text-primary font-bold">{maxNotificationDist} km</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={maxNotificationDist}
              onChange={(e) => setMaxNotificationDist(Number(e.target.value))}
              onMouseUp={handleUpdate}
              onTouchEnd={handleUpdate}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-gray-400 mt-1">Vedrai eventi solo entro questo raggio.</p>
          </div>

          <button 
            type="button"
            onClick={handleUpdateGPS}
            disabled={loading}
            className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <MapPin size={18} />
            Aggiorna Posizione Attuale
          </button>
        </section>
      </div>
    </div>
  );
}
