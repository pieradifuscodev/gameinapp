import { User } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface BasicDataStepProps {
  name: string;
  setName: (v: string) => void;
  surname: string;
  setSurname: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BasicDataStep({
  name, setName,
  surname, setSurname,
  username, setUsername,
  avatar, setAvatar,
  onNext, onBack
}: BasicDataStepProps) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
        <User size={16} className="text-slate-700" /> Chi sei?
      </h2>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-700 mb-1">Nome *</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-none" 
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-700 mb-1">Cognome *</label>
          <input 
            type="text" 
            value={surname} 
            onChange={e => setSurname(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-none" 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Username (univoco) *</label>
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-none" 
        />
      </div>
      
      <div className="flex flex-col items-center mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-2">Foto Profilo / Logo (opzionale)</label>
        <ImageUpload value={avatar} onChange={setAvatar} />
      </div>

      <div className="mt-auto pt-4 flex gap-2">
        <button onClick={onBack} className="w-1/3 py-3.5 bg-white text-slate-700 rounded-xl font-bold text-base active:scale-[0.98] border border-slate-200 hover:bg-slate-50">
          Indietro
        </button>
        <button 
          onClick={onNext}
          className="w-2/3 py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-sm active:scale-[0.98] transition-transform hover:bg-primary/90"
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
