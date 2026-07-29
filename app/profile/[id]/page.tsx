import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChevronLeft, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/profile/FollowButton";
import { CompactEventCard } from "@/components/events/CompactEventCard";

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
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
      {/* ── TOP HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-50 pt-[max(env(safe-area-inset-top),12px)]">
        <Link href="/" className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <span className="text-[15px] font-bold text-slate-900">
          {profile.username || "Profilo"}
        </span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Intestazione Profilo */}
        <div className="bg-white px-5 py-6 border-b border-slate-200">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-full flex justify-center items-center font-bold text-3xl shadow-sm shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <>{profile.name?.charAt(0) || ""}{profile.surname?.charAt(0) || ""}</>
              )}
            </div>
            
            <div className="flex flex-1 justify-around">
              <div className="flex flex-col items-center">
                <span className="font-black text-xl text-slate-900">{profile._count.createdEvents}</span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Eventi</span>
              </div>
              <Link href={`/profile/${id}/followers`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="font-black text-xl text-slate-900">{profile._count.followedBy}</span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Follower</span>
              </Link>
              <Link href={`/profile/${id}/following`} className="flex flex-col items-center active:opacity-70 transition-opacity">
                <span className="font-black text-xl text-slate-900">{profile._count.following}</span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Seguiti</span>
              </Link>
            </div>
          </div>

          <div className="mb-5">
            <h1 className="font-bold text-[17px] text-slate-900 leading-tight">
              {profile.role === 'STRUTTURA' ? profile.companyName : `${profile.name} ${profile.surname}`}
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {profile.role === 'PLAYER' ? 'Giocatore' : 'Struttura'}
            </p>
            {profile.bio && (
              <p className="text-[14px] text-slate-800 mt-2 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {!isOwnProfile && (
            <FollowButton userId={profile.id} initialIsFollowing={isFollowing} />
          )}
        </div>

        {/* Foto Struttura (solo per organizzatori) */}
        {profile.role === 'STRUTTURA' && profile.facilityImages && profile.facilityImages.length > 0 && (
          <div className="bg-white px-0 py-5 mt-2 border-y border-slate-200">
            <h2 className="font-bold text-slate-900 text-[15px] px-5 mb-3 uppercase tracking-wide">I Nostri Campi</h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 pb-2 snap-x">
              {profile.facilityImages.map((img, idx) => (
                <div key={idx} className="w-56 h-40 shrink-0 snap-center rounded-xl overflow-hidden shadow-sm border border-slate-100 relative">
                  <img src={img} alt={`Campo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eventi Pubblicati */}
        <div className="px-4 py-6 pb-24">
          <h2 className="font-bold text-slate-900 text-[15px] mb-4 uppercase tracking-wide">Eventi Attivi</h2>
          
          {activeEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeEvents.map(event => (
                <CompactEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <Users size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Nessun evento attivo al momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
