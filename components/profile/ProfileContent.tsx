import Link from "next/link";
import { getSportDetails } from "@/lib/sports";

interface EventData {
  id: string;
  sport: string;
  title: string;
  dateStart: Date | string;
  gym?: { name: string } | null;
  location?: string | null;
}

interface CircleData {
  id: string;
  name: string;
  boardText?: string | null;
}

interface ProfileContentProps {
  currentTab: string;
  participations: EventData[];
  createdEvents: EventData[];
  circles: CircleData[];
  ownedCircles: CircleData[];
}

export function ProfileContent({
  currentTab,
  participations,
  createdEvents,
  circles,
  ownedCircles
}: ProfileContentProps) {
  return (
    <div className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-3 bg-white">
      {currentTab === 'partecipazioni' && (
        participations.length > 0 ? (
          participations.map(ev => {
            const sport = getSportDetails(ev.sport);
            return (
              <Link href={`/events/${ev.id}`} key={ev.id} className="relative bg-white p-3 rounded-lg border border-slate-200 flex flex-col active:bg-slate-50 transition-colors overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${sport.color}`}></div>
                <div className="pl-2">
                  <span className={`text-[9px] font-bold w-fit px-1.5 py-0.5 rounded uppercase mb-1 flex items-center gap-1 ${sport.pillColor} ${sport.pillText}`}>
                    {sport.icon} {sport.label}
                  </span>
                  <span className="font-bold text-slate-900 text-[13px] mb-0.5 block truncate">{ev.title}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym?.name || ev.location}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center p-6 text-slate-500 bg-white rounded-lg border border-dashed border-slate-300 mt-2">
            <p className="text-[13px] font-medium">Nessun evento a cui partecipi.</p>
          </div>
        )
      )}

      {currentTab === 'creati' && (
        createdEvents.length > 0 ? (
          createdEvents.map(ev => {
            const sport = getSportDetails(ev.sport);
            return (
              <Link href={`/events/${ev.id}`} key={ev.id} className="relative bg-white p-3 rounded-lg border border-slate-200 flex flex-col active:bg-slate-50 transition-colors overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${sport.color}`}></div>
                <div className="pl-2">
                  <span className={`text-[9px] font-bold w-fit px-1.5 py-0.5 rounded uppercase mb-1 flex items-center gap-1 ${sport.pillColor} ${sport.pillText}`}>
                    {sport.icon} {sport.label}
                  </span>
                  <span className="font-bold text-slate-900 text-[13px] mb-0.5 block truncate">{ev.title}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{new Date(ev.dateStart).toLocaleDateString('it-IT')} • {ev.gym?.name || ev.location}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center p-6 text-slate-500 bg-white rounded-lg border border-dashed border-slate-300 mt-2">
            <p className="text-[13px] font-medium">Non hai ancora creato eventi.</p>
          </div>
        )
      )}

      {currentTab === 'cerchie' && (
        [...ownedCircles, ...circles].length > 0 ? (
          [...ownedCircles, ...circles].map(circle => (
            <div key={circle.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col">
              <span className="font-bold text-slate-900 text-[13px] mb-0.5">{circle.name}</span>
              <span className="text-[11px] text-slate-500 font-medium leading-relaxed">{circle.boardText}</span>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-slate-500 bg-white rounded-lg border border-dashed border-slate-300 mt-2">
            <p className="text-[13px] font-medium">Non appartieni a nessuna cerchia.</p>
          </div>
        )
      )}
    </div>
  );
}
