import Link from "next/link";
import { Calendar, Trophy, Users } from "lucide-react";

interface ProfileTabsProps {
  currentTab: string;
}

export function ProfileTabs({ currentTab }: ProfileTabsProps) {
  return (
    <div className="flex sticky top-14 z-10 bg-[#16161A] border-b border-[#222226]">
      <Link 
        href="?tab=partecipazioni" 
        scroll={false} 
        className={`flex-1 flex justify-center items-center py-3 transition-colors ${currentTab === 'partecipazioni' ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]' : 'text-[#8E8E93] border-b-2 border-transparent hover:text-white'}`}
      >
        <Calendar size={22} strokeWidth={currentTab === 'partecipazioni' ? 2.5 : 1.5} />
      </Link>
      
      <Link 
        href="?tab=creati" 
        scroll={false} 
        className={`flex-1 flex justify-center items-center py-3 transition-colors ${currentTab === 'creati' ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]' : 'text-[#8E8E93] border-b-2 border-transparent hover:text-white'}`}
      >
        <Trophy size={22} strokeWidth={currentTab === 'creati' ? 2.5 : 1.5} />
      </Link>
    </div>
  );
}
