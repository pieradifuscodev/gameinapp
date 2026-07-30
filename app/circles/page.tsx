import Link from "next/link";
import { Users, Search, Plus, ShieldAlert } from "lucide-react";

export default function CirclesPage() {
  return (
    <div className="flex flex-col flex-1 bg-[#0C0C0E] min-h-screen pb-[120px]">
      
      {/* ── HEADER ── */}
      <div className="bg-[#0C0C0E]/90 backdrop-blur-xl pt-4 pb-4 px-4 border-b border-[#222226] sticky top-14 z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Le Tue Cerchie</h1>
            <p className="text-[#8E8E93] text-[13px] font-bold">Gioca e organizzati con i tuoi amici</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Cerca cerchie..."
              className="w-full bg-[#16161A] text-[14px] text-white rounded-[8px] py-3 pl-10 pr-4 font-bold outline-none focus:ring-1 focus:ring-[#CCFF00] transition-all border border-[#222226] placeholder:text-[#8E8E93]"
            />
          </div>
          <button 
            className="bg-[#CCFF00] border-none text-black p-3 rounded-[24px] active:bg-[#a6d100] hover:scale-105 transition-all shrink-0"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-12">
        <div className="w-16 h-16 bg-[#16161A] border border-[#222226] rounded-[16px] flex items-center justify-center mb-4 shadow-lg shadow-black/50">
          <Users size={32} className="text-[#8E8E93]" />
        </div>
        <h2 className="text-white text-xl font-black tracking-tight mb-2">Nessuna cerchia</h2>
        <p className="text-[#8E8E93] text-[13px] font-medium leading-relaxed max-w-[280px]">
          Non fai ancora parte di nessuna cerchia. Creane una per organizzare partite private o cerca tra quelle esistenti!
        </p>
        
        <div className="mt-8 p-4 bg-[#16161A] border border-[#222226] rounded-[12px] flex items-start gap-3 text-left w-full max-w-[320px]">
          <ShieldAlert size={20} className="text-[#CCFF00] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#8E8E93] font-medium">
            Le <strong className="text-white">Cerchie</strong> sono in fase di sviluppo. Presto potrai invitare amici, gestire bacheche esclusive e organizzare tornei privati.
          </p>
        </div>
      </div>

    </div>
  );
}
