import Link from "next/link";
import { Calendar, Trophy, Users } from "lucide-react";

interface ProfileTabsProps {
  currentTab: string;
}

export function ProfileTabs({ currentTab }: ProfileTabsProps) {
  return (
    <div className="flex sticky top-[53px] z-10 bg-white border-b border-slate-200">
      <Link 
        href="?tab=partecipazioni" 
        scroll={false} 
        className={`flex-1 flex justify-center items-center py-3 transition-colors ${currentTab === 'partecipazioni' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'}`}
      >
        <Calendar size={22} strokeWidth={currentTab === 'partecipazioni' ? 2.5 : 1.5} />
      </Link>
      
      <Link 
        href="?tab=creati" 
        scroll={false} 
        className={`flex-1 flex justify-center items-center py-3 transition-colors ${currentTab === 'creati' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'}`}
      >
        <Trophy size={22} strokeWidth={currentTab === 'creati' ? 2.5 : 1.5} />
      </Link>
      
      <Link 
        href="?tab=cerchie" 
        scroll={false} 
        className={`flex-1 flex justify-center items-center py-3 transition-colors ${currentTab === 'cerchie' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'}`}
      >
        <Users size={22} strokeWidth={currentTab === 'cerchie' ? 2.5 : 1.5} />
      </Link>
    </div>
  );
}
