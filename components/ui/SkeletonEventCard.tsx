import React from "react";

export default function SkeletonEventCard() {
  return (
    <div className="block shrink-0 w-[280px] snap-start">
      <div className="bg-[#16161A] rounded-[12px] p-5 border border-[#222226] flex flex-col h-full animate-pulse shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 w-20 bg-[#222226] rounded-lg"></div>
          <div className="h-6 w-16 bg-[#222226] rounded-lg"></div>
        </div>

        {/* Titolo e Luogo */}
        <div className="flex-1 flex flex-col justify-start mb-4">
          <div className="h-5 bg-[#222226] rounded-md w-3/4 mb-2"></div>
          <div className="h-5 bg-[#222226] rounded-md w-1/2 mb-3"></div>
          <div className="h-3 bg-[#222226] rounded-md w-2/3"></div>
        </div>

        {/* Data e Ora */}
        <div className="flex items-center gap-2.5 my-3">
          <div className="bg-[#222226] rounded-[8px] w-[48px] h-[48px] shrink-0"></div>
          <div className="flex flex-col gap-1 w-full">
            <div className="h-4 bg-[#222226] rounded-md w-1/3"></div>
            <div className="h-3 bg-[#222226] rounded-md w-1/4"></div>
          </div>
        </div>

        {/* Mini Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="h-5 w-16 bg-[#222226] rounded"></div>
          <div className="h-5 w-20 bg-[#222226] rounded"></div>
        </div>

        {/* Footer (Progress Bar) */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#222226] mt-auto">
          <div className="flex-1">
            <div className="flex justify-between mb-1.5">
              <div className="h-3 w-1/3 bg-[#222226] rounded-md"></div>
              <div className="h-3 w-1/4 bg-[#222226] rounded-md"></div>
            </div>
            <div className="h-1 rounded-full bg-[#222226] w-full"></div>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#222226]"></div>
        </div>
      </div>
    </div>
  );
}
