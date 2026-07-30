import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface HomeHeaderProps {
  greeting: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  hasFilters: boolean;
  onOpenFilter: () => void;
  activeTab: "EXPLORE" | "FOLLOWING";
  setActiveTab: (tab: "EXPLORE" | "FOLLOWING") => void;
}

export default function HomeHeader({ greeting, searchQuery, setSearchQuery, hasFilters, onOpenFilter, activeTab, setActiveTab }: HomeHeaderProps) {
  return (
    <div className="bg-[#0C0C0E]/95 backdrop-blur-xl pt-3 fixed top-14 left-0 right-0 z-20 transition-all border-b border-[#222226]">
      <div className="px-4 pb-4">

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Cerca eventi o palestre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16161A] text-[14px] text-white rounded-[8px] py-3 pl-10 pr-4 font-bold outline-none focus:ring-1 focus:ring-[#CCFF00] transition-all border border-[#222226] placeholder:text-[#8E8E93] placeholder:font-medium"
            />
          </div>
          <button 
            onClick={onOpenFilter}
            className="bg-[#CCFF00] border-none text-black p-3 rounded-[24px] active:bg-[#a6d100] hover:scale-105 transition-all shrink-0 relative"
          >
            <SlidersHorizontal size={18} />
            {hasFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#CCFF00]"></span>
            )}
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="px-4 flex items-center gap-4">
        <button 
          onClick={() => setActiveTab("EXPLORE")}
          className={`pb-3 border-b-2 text-[15px] font-black transition-colors ${activeTab === 'EXPLORE' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-[#8E8E93] hover:text-white'}`}
        >
          Esplora
        </button>
        <button 
          onClick={() => setActiveTab("FOLLOWING")}
          className={`pb-3 border-b-2 text-[15px] font-black transition-colors ${activeTab === 'FOLLOWING' ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-transparent text-[#8E8E93] hover:text-white'}`}
        >
          Seguiti
        </button>
      </div>
    </div>
  );
}
