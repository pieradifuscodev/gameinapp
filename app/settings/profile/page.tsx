"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, User, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { AvatarSelector } from "@/components/ui/AvatarSelector";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [facilityImages, setFacilityImages] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isOrganizer = (session?.user as any)?.role === "STRUTTURA";

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            const u = data.user;
            setName(u.name || "");
            setSurname(u.surname || "");
            setUsername(u.username || "");
            setEmail(u.email || "");
            setAvatar(u.avatar || "");
            setBio(u.bio || "");
            setCompanyName(u.companyName || "");
            setVatNumber(u.vatNumber || "");
            setFacilityImages(u.facilityImages || []);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfile();
    }
  }, [(session?.user as any)?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          username,
          email,
          avatar,
          bio,
          companyName,
          vatNumber,
          facilityImages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore durante l'aggiornamento");
      }

      await update({ 
        name, 
        surname,
        username, 
        email, 
        avatar,
        bio,
        companyName,
        vatNumber,
        facilityImages
      });
      
      setMessage({ type: 'success', text: "Profilo aggiornato con successo!" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] relative pb-safe">
      
      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        {message && (
          <div className={`p-4 mb-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20'
          }`}>
            {message.type === 'error' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
          <section className="bg-[#16161A] rounded-2xl p-4 border border-[#222226]">
            <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <User size={16} className="text-[#CCFF00]" /> Dati Anagrafici
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col mb-4">
                <label className="block text-xs font-bold text-[#8E8E93] mb-3 text-center">Scegli il tuo Avatar</label>
                <AvatarSelector value={avatar} onChange={setAvatar} />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#8E8E93] mb-1">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#8E8E93] mb-1">Cognome</label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] mb-1">Biografia</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Scrivi qualcosa su di te..."
                  rows={3}
                  className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00] resize-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#8E8E93] mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00] transition-all"
                />
              </div>

            </div>
          </section>

          {isOrganizer && (
            <section className="bg-[#16161A] rounded-2xl p-4 border border-[#222226]">
              <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wide">
                Dati Aziendali & Struttura
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] mb-1">Nome Struttura/Azienda</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] mb-1">Partita IVA</label>
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    className="w-full bg-[#0C0C0E] border border-[#222226] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/80 focus:border-[#CCFF00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] mb-2">Foto della Struttura / Campi</label>
                  <MultiImageUpload value={facilityImages} onChange={setFacilityImages} />
                </div>
              </div>
            </section>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#CCFF00] text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md uppercase tracking-wider hover:bg-[#b3ff00]"
          >
            <Save size={18} />
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </form>
      </div>
    </div>
  );
}
