import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MapPin, Users, Building2, BadgeCheck, ClipboardList } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/profile/FollowButton";
import { CompactEventCard } from "@/components/events/CompactEventCard";
import MapClientWrapper from "@/components/ui/MapClientWrapper";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const currentUserId = (session.user as any).id;
  const isOwnProfile = currentUserId === id;

  const profile = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: { followedBy: true, following: true, createdEvents: true }
      },
      followedBy: {
        where: { id: currentUserId },
        select: { id: true }
      }
    }
  });

  if (!profile) {
    return notFound();
  }

  const isFollowing = profile.followedBy.length > 0;
  const isStructure = profile.role === "STRUTTURA";

  // Recupera eventi attivi
  const now = new Date();
  const activeEvents = await prisma.event.findMany({
    where: {
      creatorId: profile.id,
      status: "OPEN",
      dateStart: { gte: now }
    },
    include: {
      gym: true,
      participants: true
    },
    orderBy: {
      dateStart: "asc"
    }
  });

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] overflow-y-auto pb-safe">
      <div className="flex-1">
        {/* Intestazione Profilo */}
        <div className={`px-5 py-6 border-b border-[#222226] relative overflow-hidden ${isStructure ? 'bg-gradient-to-b from-[#0c1a1f] to-[#16161A]' : 'bg-[#16161A]'}`}>
          {isStructure && (
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#00F0FF] shadow-[0_2px_10px_rgba(0,240,255,0.4)]" />
          )}

          <div className="flex items-center gap-5 mb-5">
            <div className={`w-20 h-20 bg-[#0C0C0E] text-white rounded-full flex justify-center items-center font-bold text-3xl shadow-sm shrink-0 border relative ${isStructure ? 'border-[#00F0FF]' : 'border-[#222226]'}`}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                isStructure ? <Building2 size={32} className="text-[#00F0FF]" /> : <>{profile.name?.charAt(0) || ""}{profile.surname?.charAt(0) || ""}</>
              )}
              {isStructure && (
                <div className="absolute -bottom-1 -right-1 bg-[#00F0FF] text-black rounded-full p-1 border-2 border-[#16161A]">
                  <BadgeCheck size={14} className="fill-black text-[#00F0FF]" />
                </div>
              )}
            </div>
            
            <div className="flex flex-1 justify-around">
              <div className="flex flex-col items-center">
                <span className="font-black text-xl text-white">{profile._count.createdEvents}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">{isStructure ? 'Partite' : 'Eventi'}</span>
              </div>
              <Link href={`/profile/${id}/followers`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="font-black text-xl text-white">{profile._count.followedBy}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">{isStructure ? 'Clienti' : 'Follower'}</span>
              </Link>
              <Link href={`/profile/${id}/following`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="font-black text-xl text-white">{profile._count.following}</span>
                <span className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-wider mt-0.5">Seguiti</span>
              </Link>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-[17px] text-white leading-tight">
                {isStructure ? profile.companyName : `${profile.name} ${profile.surname}`}
              </h1>
              {isStructure && (
                <span className="text-[10px] font-black uppercase text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <BadgeCheck size={10} className="fill-[#00F0FF] text-[#16161A]" /> Verificato
                </span>
              )}
            </div>

            <p className={`text-[13px] font-bold mt-0.5 ${isStructure ? 'text-[#00F0FF]' : 'text-[#8E8E93]'}`}>
              {profile.role === 'PLAYER' ? 'Giocatore' : 'Struttura Partner'}
            </p>

            {isStructure && profile.addressUser && (
              <p className="text-[12px] text-[#8E8E93] flex items-center gap-1 mt-2.5 font-bold">
                <MapPin size={12} className="text-[#00F0FF]" /> {profile.addressUser}
              </p>
            )}

            {isStructure && profile.vatNumber && (
              <p className="text-[10px] text-[#8E8E93] flex items-center gap-1 mt-0.5 font-bold">
                <ClipboardList size={12} className="text-[#8E8E93]" /> P.IVA: {profile.vatNumber}
              </p>
            )}

            {profile.bio && (
              <p className="text-[14px] text-white mt-3 leading-relaxed font-medium">
                {profile.bio}
              </p>
            )}
          </div>

          {!isOwnProfile && (
            <FollowButton userId={profile.id} initialIsFollowing={isFollowing} isStructure={isStructure} />
          )}
        </div>

        {/* Foto Struttura (solo per organizzatori) */}
        {profile.role === 'STRUTTURA' && profile.facilityImages && profile.facilityImages.length > 0 && (
          <div className="bg-[#16161A] px-0 py-5 mt-2 border-y border-[#222226]">
            <h2 className="font-black text-white text-[15px] px-5 mb-3 uppercase tracking-wide">I Nostri Campi</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-2 snap-x">
              {profile.facilityImages.map((img, idx) => (
                <div key={idx} className="w-56 h-40 shrink-0 snap-center rounded-xl overflow-hidden shadow-sm border border-[#222226] relative bg-[#0C0C0E]">
                  <img src={img} alt={`Campo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mappa Posizione (solo per organizzatori) */}
        {isStructure && profile.latitude && profile.longitude && (
          <div className="bg-[#16161A] px-5 py-5 mt-2 border-y border-[#222226]">
            <h2 className="font-black text-white text-[15px] mb-3 uppercase tracking-wide">Mappa Posizione</h2>
            <div className="h-40 w-full rounded-xl overflow-hidden border border-[#222226] relative bg-[#0C0C0E] z-0">
              <MapClientWrapper 
                events={[]} 
                center={{ lat: profile.latitude, lng: profile.longitude }} 
                radius={1} 
              />
            </div>
          </div>
        )}

        {/* Eventi Pubblicati */}
        <div className="px-4 py-6 pb-24">
          <h2 className="font-black text-white text-[15px] mb-4 uppercase tracking-wide">Eventi Attivi</h2>
          
          {activeEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeEvents.map(event => (
                <CompactEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-[#8E8E93]">
              <Users size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Nessun evento attivo al momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
