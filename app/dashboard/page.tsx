import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Activity, PlusCircle, Settings, Home } from "lucide-react";

export default async function DashboardPage({ searchParams }: { searchParams: { tab?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const currentTab = (await searchParams).tab || "partecipazioni";

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      participations: { include: { gym: true } },
      createdEvents: { include: { gym: true } },
      circles: true,
      ownedCircles: true,
    }
  });

  if (!userProfile) return <div>Utente non trovato</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Profilo Header */}
      <div className="bg-white px-4 pt-8 pb-6 shadow-sm border-b border-gray-100 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full text-white flex items-center justify-center text-3xl font-black mb-3 shadow-md">
          {userProfile.name[0]}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{userProfile.name} {userProfile.surname}</h1>
        <p className="text-sm text-gray-500 mb-3">{userProfile.email}</p>
        
        <div className="flex gap-2">
          <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            {userProfile.role}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Activity size={10} /> {userProfile.favoriteSports.length} Sport
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-2 py-2 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <Link href="?tab=partecipazioni" className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors ${currentTab === 'partecipazioni' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
          I Miei Eventi
        </Link>
        <Link href="?tab=creati" className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors ${currentTab === 'creati' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
          Eventi Creati
        </Link>
        <Link href="?tab=cerchie" className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors ${currentTab === 'cerchie' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
          Cerchie
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {currentTab === 'partecipazioni' && (
          userProfile.participations.length > 0 ? (
            userProfile.participations.map(ev => (
              <Link href={`/events/${ev.id}`} key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-blue-600 mb-1">{ev.sport}</span>
                <span className="font-bold text-gray-900 text-sm mb-1">{ev.title}</span>
                <span className="text-xs text-gray-500">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-8">Nessun evento a cui partecipi.</p>
          )
        )}

        {currentTab === 'creati' && (
          userProfile.createdEvents.length > 0 ? (
            userProfile.createdEvents.map(ev => (
              <Link href={`/events/${ev.id}`} key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-purple-600 mb-1">{ev.sport}</span>
                <span className="font-bold text-gray-900 text-sm mb-1">{ev.title}</span>
                <span className="text-xs text-gray-500">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-8">Non hai creato nessun evento.</p>
          )
        )}

        {currentTab === 'cerchie' && (
          [...userProfile.ownedCircles, ...userProfile.circles].length > 0 ? (
            [...userProfile.ownedCircles, ...userProfile.circles].map(circle => (
              <div key={circle.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                <span className="font-bold text-gray-900 text-sm mb-1">{circle.name}</span>
                <span className="text-xs text-gray-500 line-clamp-2">{circle.boardText}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-8">Nessuna cerchia trovata.</p>
          )
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)] flex justify-around p-3 z-50">
        <Link href="/" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600">
          <Home size={22} />
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </Link>
        <Link href="/events/new" className="flex flex-col items-center p-2 text-gray-400 hover:text-blue-600">
          <PlusCircle size={22} />
          <span className="text-[10px] mt-1 font-semibold">Nuovo</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-blue-600">
          <User size={22} />
          <span className="text-[10px] mt-1 font-semibold">Profilo</span>
        </Link>
      </nav>
    </main>
  );
}
