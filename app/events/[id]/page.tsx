import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, MapPin, Users, Info } from "lucide-react";
import Link from "next/link";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      gym: true,
      creator: true,
      participants: true,
    },
  });

  if (!event) {
    return notFound();
  }

  const spotsLeft = event.maxPlayers - event.participants.length;
  const isFull = spotsLeft <= 0;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-4 py-4 flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 truncate">Dettagli Evento</h1>
      </header>

      {/* Hero Section */}
      <div className="bg-white px-4 py-6 mb-2 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {event.sport}
          </span>
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
            event.status === 'OPEN' ? 'text-green-700 bg-green-100' : 'text-gray-500 bg-gray-100'
          }`}>
            {event.status}
          </span>
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{event.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
      </div>

      {/* Info Cards */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">DATA E ORA</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(event.dateStart).toLocaleString('it-IT', { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">STRUTTURA</p>
            <p className="text-sm font-medium text-gray-900 mb-0.5">{event.gym.name}</p>
            <p className="text-xs text-gray-500">{event.gym.address}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Users size={20} />
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-500 font-semibold mb-0.5">PARTECIPANTI</p>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {event.participants.length} su {event.maxPlayers} posti
              </p>
              <span className={`text-xs font-bold ${spotsLeft <= 2 ? 'text-red-500' : 'text-green-600'}`}>
                {isFull ? 'Completo' : `${spotsLeft} posti rimasti`}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min((event.participants.length / event.maxPlayers) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 mt-2">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Info size={16} /> Organizzatore
        </h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold">
            {event.creator.name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{event.creator.name} {event.creator.surname}</p>
            <p className="text-xs text-gray-500">Organizzatore evento</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe">
        <button 
          disabled={isFull}
          className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-[0.98] ${
            isFull 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFull ? 'Evento Completo' : 'Iscriviti e Paga (Stripe)'}
        </button>
      </div>
    </main>
  );
}
