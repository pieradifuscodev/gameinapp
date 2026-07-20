import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, Calendar, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { getSportDetails } from "@/lib/sports";

const WaveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,128L48,149.3C96,171,192,213,288,213.3C384,213,480,171,576,144C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
  </svg>
);

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const currentTab = resolvedSearchParams.tab || "partecipazioni";

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      participations: { include: { gym: true } },
      createdEvents: { include: { gym: true } },
      circles: true,
      ownedCircles: true,
      followedBy: true,
      following: true,
    }
  });

  if (!userProfile) return <div>Utente non trovato</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header Colorato a tutto schermo (Blue Theme) */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 pt-safe overflow-hidden pb-16">
        
        {/* Onde di sfondo */}
        <WaveSVG className="absolute bottom-0 left-0 w-[150%] h-[40%] text-white/10" />
        
        {/* Forma geometrica astratta */}
        <div className="absolute top-10 right-4 w-32 h-40 rotate-12 -skew-x-12 bg-white/5 rounded-3xl" />
        <div className="absolute top-20 -left-10 w-24 h-24 -rotate-12 bg-white/10 rounded-full blur-2xl" />

        {/* Settings Action Bar (trasparente sul blu) */}
        <div className="sticky top-0 z-20 flex justify-end p-4">
          <Link 
            href="/settings" 
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/30 text-white active:scale-95 transition-transform"
          >
            <Settings size={22} />
          </Link>
        </div>

        {/* Profile Header (Testo Bianco - Layout Orizzontale) */}
        <div className="flex items-center gap-4 px-4 relative z-10 -mt-4">
          <div className="relative shrink-0">
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-cyan-400 to-blue-400 text-white flex items-center justify-center text-2xl font-black shadow-xl">
                {userProfile.name?.[0] || ""}{userProfile.surname?.[0] || ""}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-start text-left">
            <h1 className="text-xl font-black text-white tracking-tight drop-shadow-sm leading-tight">
              {userProfile.name} {userProfile.surname}
            </h1>
            <p className="text-primary/20 font-medium mb-1 text-xs opacity-90">@{userProfile.username}</p>
            
            {userProfile.bio && (
              <p className="text-xs text-white/90 max-w-full leading-snug line-clamp-2">
                {userProfile.bio}
              </p>
            )}

            <span className="mt-1.5 text-[10px] uppercase font-bold text-primary bg-white px-2 py-0.5 rounded-full shadow-sm">
              {userProfile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Social Stats & Sports */}
      <div className="relative px-4 z-20 -mt-10 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col">
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-gray-900">{userProfile.createdEvents.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Creati</span>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-gray-900">{userProfile.followedBy.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Seguaci</span>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-gray-900">{userProfile.following.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Seguiti</span>
            </div>
          </div>
          
          {userProfile.favoriteSports.length > 0 && (
            <>
              <div className="h-px bg-gray-100 my-3 w-full"></div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-2">Sport Preferiti</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {userProfile.favoriteSports.map(sportId => {
                    const sport = getSportDetails(sportId);
                    return (
                      <span key={sportId} className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-sm ${sport.pillColor} ${sport.pillText}`}>
                        {sport.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 sticky top-0 z-10 bg-slate-50 py-2">
        <Link href="?tab=partecipazioni" scroll={false} className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all ${currentTab === 'partecipazioni' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}>
          <Calendar size={18} className="mb-1" />
          <span className="text-[10px] font-bold">I Miei Eventi</span>
        </Link>
        <Link href="?tab=creati" scroll={false} className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all ${currentTab === 'creati' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}>
          <Trophy size={18} className="mb-1" />
          <span className="text-[10px] font-bold">Eventi Creati</span>
        </Link>
        <Link href="?tab=cerchie" scroll={false} className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all ${currentTab === 'cerchie' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'}`}>
          <Users size={18} className="mb-1" />
          <span className="text-[10px] font-bold">Cerchie</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 flex flex-col gap-3">
        {currentTab === 'partecipazioni' && (
          userProfile.participations.length > 0 ? (
            userProfile.participations.map(ev => {
              const sport = getSportDetails(ev.sport);
              return (
                <Link href={`/events/${ev.id}`} key={ev.id} className="relative bg-white p-4 rounded-2xl shadow-sm flex flex-col active:scale-[0.98] transition-transform overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${sport.color}`}></div>
                  <div className="pl-2">
                    <span className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded uppercase mb-2 flex items-center gap-1 ${sport.pillColor} ${sport.pillText}`}>
                      {sport.icon} {sport.label}
                    </span>
                    <span className="font-black text-gray-900 text-base mb-1 block">{ev.title}</span>
                    <span className="text-xs text-gray-500 font-medium">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym?.name || ev.location}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center p-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm font-semibold">Nessun evento a cui partecipi.</p>
            </div>
          )
        )}

        {currentTab === 'creati' && (
          userProfile.createdEvents.length > 0 ? (
            userProfile.createdEvents.map(ev => {
              const sport = getSportDetails(ev.sport);
              return (
                <Link href={`/events/${ev.id}`} key={ev.id} className="relative bg-white p-4 rounded-2xl shadow-sm flex flex-col active:scale-[0.98] transition-transform overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${sport.color}`}></div>
                  <div className="pl-2">
                    <span className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded uppercase mb-2 flex items-center gap-1 ${sport.pillColor} ${sport.pillText}`}>
                      {sport.icon} {sport.label}
                    </span>
                    <span className="font-black text-gray-900 text-base mb-1 block">{ev.title}</span>
                    <span className="text-xs text-gray-500 font-medium">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym?.name || ev.location}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center p-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm font-semibold">Non hai ancora creato eventi.</p>
            </div>
          )
        )}

        {currentTab === 'cerchie' && (
          [...userProfile.ownedCircles, ...userProfile.circles].length > 0 ? (
            [...userProfile.ownedCircles, ...userProfile.circles].map(circle => (
              <div key={circle.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <span className="font-black text-gray-900 text-base mb-1">{circle.name}</span>
                <span className="text-xs text-gray-500 font-medium leading-relaxed">{circle.boardText}</span>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm font-semibold">Non appartieni a nessuna cerchia.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
