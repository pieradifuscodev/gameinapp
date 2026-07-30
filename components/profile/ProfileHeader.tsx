import Link from "next/link";
import { getSportDetails, getSportIconUrl } from "@/lib/sports";
import { Building2, BadgeCheck, MapPin, ClipboardList, Settings, User } from "lucide-react";
import MapClientWrapper from "@/components/ui/MapClientWrapper";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    surname: string | null;
    username: string | null;
    avatar: string | null;
    bio: string | null;
    role: string;
    companyName?: string | null;
    vatNumber?: string | null;
    addressUser?: string | null;
    facilityImages?: string[];
    latitude?: number | null;
    longitude?: number | null;
  };
  stats: {
    createdCount: number;
    followersCount: number;
    followingCount: number;
  };
  favoriteSports: string[];
}

export function ProfileHeader({ user, stats, favoriteSports }: ProfileHeaderProps) {
  const isStructure = user.role === "STRUTTURA";

  return (
    <div className={`pt-8 border-b border-[#222226] relative overflow-hidden ${isStructure ? 'bg-gradient-to-b from-[#0c1a1f] to-[#16161A]' : 'bg-[#16161A]'}`}>
      {isStructure && (
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#00F0FF] shadow-[0_2px_10px_rgba(0,240,255,0.4)]" />
      )}

      <div className="px-4 mt-2">
        {/* Row 1: Avatar & Stats Section */}
        <div className="flex items-center">
          <div className="shrink-0 mr-3 relative">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className={`w-20 h-20 rounded-full object-cover border ${isStructure ? 'border-[#00F0FF]' : 'border-[#222226]'}`}
              />
            ) : (
              <div className={`w-20 h-20 rounded-full border bg-[#0C0C0E] text-white flex items-center justify-center text-2xl font-black ${isStructure ? 'border-[#00F0FF]' : 'border-[#222226]'}`}>
                {isStructure ? <Building2 size={32} className="text-[#00F0FF]" /> : <>{user.name?.[0] || ""}{user.surname?.[0] || ""}</>}
              </div>
            )}
            {isStructure && (
              <div className="absolute -bottom-1 -right-1 bg-[#00F0FF] text-black rounded-full p-1 border-2 border-[#16161A]">
                <BadgeCheck size={14} className="fill-black text-[#00F0FF]" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 justify-center">
            {/* Username and Badge */}
            <div className="flex items-center justify-start gap-1.5 mb-3 pl-2">
              <span className="text-[15px] font-bold text-white leading-none">@{user.username}</span>
              <span className={`inline-flex items-center text-[9px] uppercase font-black px-2 py-0.5 rounded border leading-none ${isStructure ? 'text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/20' : 'text-[#8E8E93] bg-[#222226] border-[#222226]'}`}>
                {isStructure ? 'Struttura Partner' : 'Atleta'}
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-white">{stats.createdCount}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">{isStructure ? 'Partite' : 'creati'}</span>
              </div>
              <Link href={`/profile/${user.id}/followers`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="text-base font-black text-white">{stats.followersCount}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">{isStructure ? 'Clienti' : 'follower'}</span>
              </Link>
              <Link href={`/profile/${user.id}/following`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="text-base font-black text-white">{stats.followingCount}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">{isStructure ? 'Seguiti' : 'seguiti'}</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Row 2: Name & Bio & Business Details */}
        <div className="mt-3 flex flex-col items-start text-left">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[16px] font-black text-white leading-tight">
              {isStructure ? user.companyName : `${user.name} ${user.surname}`}
            </h1>
            {isStructure && (
              <span className="text-[10px] font-black uppercase text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <BadgeCheck size={10} className="fill-[#00F0FF] text-[#16161A]" /> Verificato
              </span>
            )}
          </div>
          
          {isStructure && user.addressUser && (
            <p className="text-[12px] text-[#8E8E93] flex items-center gap-1 mt-1 font-bold">
              <MapPin size={12} className="text-[#00F0FF]" /> {user.addressUser}
            </p>
          )}

          {isStructure && user.vatNumber && (
            <p className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-0.5 font-bold">
              <ClipboardList size={12} className="text-[#8E8E93]" /> P.IVA: {user.vatNumber}
            </p>
          )}
          
          {user.bio && (
            <p className="text-[13px] text-[#8E8E93] leading-snug whitespace-pre-line mt-2 mb-1 font-medium">
              {user.bio}
            </p>
          )}
        </div>

        {/* Row 3: Favorite Sports Icons */}
        {!isStructure && favoriteSports.length > 0 && (
          <div className="mt-2 mb-3 flex flex-wrap gap-2">
            {favoriteSports.map(sportId => {
              const sport = getSportDetails(sportId);
              return (
                <div key={sportId} className="w-8 h-8 rounded-full border border-[#222226] flex items-center justify-center text-sm shadow-sm bg-[#0C0C0E] text-[#CCFF00]">
                  <img src={getSportIconUrl(sport.id)} alt={sport.label} className="w-4 h-4 object-contain" />
                </div>
              );
            })}
          </div>
        )}

        {/* Row 3b: Facility Images Slider (Only for Owner Structure) */}
        {isStructure && user.facilityImages && user.facilityImages.length > 0 && (
          <div className="mt-4 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8E8E93] block mb-2">I nostri campi</span>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 snap-x">
              {user.facilityImages.map((img, idx) => (
                <div key={idx} className="w-28 h-20 shrink-0 snap-center rounded-[8px] overflow-hidden border border-[#222226] relative bg-[#0C0C0E]">
                  <img src={img} alt={`Campo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 3c: Dynamic Map (Only for Structure) */}
        {isStructure && user.latitude && user.longitude && (
          <div className="mt-4 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8E8E93] block mb-2">Mappa Posizione</span>
            <div className="h-40 w-full rounded-xl overflow-hidden border border-[#222226] relative bg-[#0C0C0E] z-0">
              <MapClientWrapper 
                events={[]} 
                center={{ lat: user.latitude, lng: user.longitude }} 
                radius={1} 
              />
            </div>
          </div>
        )}

        {/* Row 4: Action Buttons */}
        <div className="mt-3 pb-3 flex gap-2">
          <Link 
            href="/settings/profile"
            className="flex-1 py-2 bg-[#222226] border border-[#222226] text-white font-bold text-[13px] text-center rounded-xl active:bg-[#2c2c31] transition-colors flex items-center justify-center gap-1.5"
          >
            <User size={14} /> Modifica profilo
          </Link>
          <Link 
            href="/settings"
            className="flex-1 py-2 bg-[#222226] border border-[#222226] text-white font-bold text-[13px] text-center rounded-xl active:bg-[#2c2c31] transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings size={14} /> Impostazioni
          </Link>
        </div>

      </div>
    </div>
  );
}
