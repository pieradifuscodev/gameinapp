import { Search, SlidersHorizontal } from "lucide-react";

interface HomeHeaderProps {
  greeting: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  hasFilters: boolean;
  onOpenFilter: () => void;
}

export default function HomeHeader({ greeting, searchQuery, setSearchQuery, hasFilters, onOpenFilter }: HomeHeaderProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md pt-[max(env(safe-area-inset-top),3.5rem)] pb-4 px-4 border-b border-slate-100 sticky top-0 z-20">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{greeting}</h1>
          <p className="text-slate-500 text-[13px] font-medium">Scopri cosa succede intorno a te.</p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca eventi o palestre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-[14px] text-slate-900 rounded-xl py-2.5 pl-10 pr-4 font-medium outline-none focus:ring-1 focus:ring-slate-300 transition-all border border-slate-200 placeholder:text-slate-400"
          />
        </div>
        <button 
          onClick={onOpenFilter}
          className="bg-slate-50 border border-slate-200 text-slate-900 p-2.5 rounded-xl active:bg-slate-100 transition-colors shrink-0 relative"
        >
          <SlidersHorizontal size={18} />
          {hasFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>
    </div>
  );
}
