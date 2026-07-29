import Link from "next/link";
import { getSportDetails } from "@/lib/sports";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    surname: string | null;
    username: string | null;
    avatar: string | null;
    bio: string | null;
    role: string;
  };
  stats: {
    createdCount: number;
    followersCount: number;
    followingCount: number;
  };
  favoriteSports: string[];
}

export function ProfileHeader({ user, stats, favoriteSports }: ProfileHeaderProps) {
  return (
    <div className="bg-white pt-8 border-b border-slate-200">
      
      <div className="px-4 mt-2">
        {/* Row 1: Avatar & Stats Section */}
        <div className="flex items-center">
          <div className="shrink-0 mr-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border border-slate-200 bg-slate-100 text-slate-700 flex items-center justify-center text-2xl font-semibold">
                {user.name?.[0] || ""}{user.surname?.[0] || ""}
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 justify-center">
            {/* Username and Badge */}
            <div className="flex items-center justify-start gap-1.5 mb-3 pl-2">
              <span className="text-[15px] font-bold text-slate-900 leading-none">@{user.username}</span>
              <span className="inline-flex items-center text-[9px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 leading-none">
                {user.role}
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-slate-900">{stats.createdCount}</span>
                <span className="text-[12px] text-slate-900">creati</span>
              </div>
              <Link href={`/profile/${user.id}/followers`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="text-base font-bold text-slate-900">{stats.followersCount}</span>
                <span className="text-[12px] text-slate-900">follower</span>
              </Link>
              <Link href={`/profile/${user.id}/following`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="text-base font-bold text-slate-900">{stats.followingCount}</span>
                <span className="text-[12px] text-slate-900">seguiti</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Row 2: Name & Bio */}
        <div className="mt-3 flex flex-col items-start text-left">
          <h1 className="text-sm font-bold text-slate-900 leading-tight">
            {user.name} {user.surname}
          </h1>
          
          {user.bio && (
            <p className="text-[13px] text-slate-900 leading-snug whitespace-pre-line mt-0.5 mb-1">
              {user.bio}
            </p>
          )}
        </div>

        {/* Row 3: Favorite Sports Icons */}
        {favoriteSports.length > 0 && (
          <div className="mt-2 mb-3 flex flex-wrap gap-2">
            {favoriteSports.map(sportId => {
              const sport = getSportDetails(sportId);
              return (
                <div key={sportId} className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-sm shadow-sm ${sport.pillColor} ${sport.pillText}`}>
                  {sport.icon}
                </div>
              );
            })}
          </div>
        )}

        {/* Row 4: Action Buttons */}
        <div className="mt-3 pb-3 flex gap-2">
          <Link 
            href="/settings/profile"
            className="flex-1 py-1.5 bg-slate-100 text-slate-900 font-semibold text-[13px] text-center rounded-lg active:bg-slate-200 transition-colors"
          >
            Modifica profilo
          </Link>
          <Link 
            href="/settings"
            className="flex-1 py-1.5 bg-slate-100 text-slate-900 font-semibold text-[13px] text-center rounded-lg active:bg-slate-200 transition-colors"
          >
            Impostazioni
          </Link>
        </div>

      </div>
    </div>
  );
}
