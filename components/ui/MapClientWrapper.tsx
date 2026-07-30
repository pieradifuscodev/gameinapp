"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-[#16161A] animate-pulse flex items-center justify-center text-[#8E8E93] font-bold text-xs">Caricamento Mappa...</div> 
});

interface MapClientWrapperProps {
  events: any[];
  center: { lat: number; lng: number };
  radius: number;
}

export default function MapClientWrapper({ events, center, radius }: MapClientWrapperProps) {
  return <MapComponent events={events} center={center} radius={radius} />;
}
