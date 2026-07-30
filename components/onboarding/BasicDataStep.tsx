import { User } from "lucide-react";
import { AvatarSelector } from "@/components/ui/AvatarSelector";

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
  isOrganizer?: boolean;
}

export function BasicDataStep({
  name, setName,
  surname, setSurname,
  username, setUsername,
  avatar, setAvatar,
  onNext, onBack,
  isOrganizer = false
}: BasicDataStepProps) {
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wide">
        <User size={16} style={{ color: accentColor }} /> Chi sei?
      </h2>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Nome *</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-accent"
            style={{ '--tw-ring-color': accentColor } as any}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Cognome *</label>
          <input 
            type="text" 
            value={surname} 
            onChange={e => setSurname(e.target.value)} 
            className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#8E8E93] mb-1.5 uppercase tracking-wide">Username *</label>
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} 
          className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-accent"
        />
      </div>
      
      <div className="flex flex-col mb-4 mt-2">
        <label className="block text-xs font-bold text-[#8E8E93] mb-3 text-center uppercase tracking-wide">Scegli il tuo Avatar</label>
        <AvatarSelector value={avatar} onChange={setAvatar} />
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onBack} 
          className="w-1/3 py-3.5 bg-transparent text-white rounded-xl font-black uppercase tracking-wider text-xs active:scale-[0.98] border border-[#222226] hover:bg-[#0C0C0E] transition-all"
        >
          Indietro
        </button>
        <button 
          onClick={onNext}
          className="w-2/3 py-3.5 rounded-xl text-black font-black uppercase tracking-wider text-xs shadow-md active:scale-[0.98] transition-all"
          style={{ backgroundColor: accentColor }}
        >
          Avanti
        </button>
      </div>
    </div>
  );
}
