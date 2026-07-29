import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/profile/FollowButton";

export default async function FollowingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const currentUserId = (session.user as any).id;

  const profile = await prisma.user.findUnique({
    where: { id },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          companyName: true,
          role: true,
          avatar: true,
        },
        orderBy: { username: 'asc' }
      }
    }
  });

  if (!profile) {
    return notFound();
  }

  // Otteniamo la lista di ID che l'utente loggato sta attualmente seguendo per mostrare il bottone corretto
  const currentUserFollowing = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      following: {
        select: { id: true }
      }
    }
  });

  const currentUserFollowingIds = new Set(currentUserFollowing?.following.map(u => u.id) || []);

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b border-slate-200 sticky top-0 z-50 pt-[max(env(safe-area-inset-top),12px)] bg-white">
        <Link href={`/profile/${id}`} className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <span className="text-[15px] font-bold text-slate-900 ml-2">
          {profile.username || "Utente"} - Seguiti
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
        {profile.following.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p className="text-sm font-medium">Nessun utente seguito.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {profile.following.map(user => {
              const displayName = user.role === 'STRUTTURA' ? user.companyName : `${user.name || ''} ${user.surname || ''}`.trim();
              const isFollowing = currentUserFollowingIds.has(user.id);
              
              return (
                <div key={user.id} className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Link href={`/profile/${user.id}`} className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex justify-center items-center font-bold text-lg shrink-0 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <>{user.name?.charAt(0) || ""}{user.surname?.charAt(0) || ""}</>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{user.username || displayName}</p>
                      <p className="text-[12px] text-slate-500 truncate">{displayName}</p>
                    </div>
                  </Link>
                  {user.id !== currentUserId && (
                    <div className="shrink-0 w-32">
                      <FollowButton userId={user.id} initialIsFollowing={isFollowing} compact />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
