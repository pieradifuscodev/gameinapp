"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { getSportDetails, getSportIconUrl } from "@/lib/sports";
import { Navigation, X } from "lucide-react";

// Fix leaflet default icons issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function MapInteractionHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => onMapClick(),
  });
  return null;
}

export default function MapComponent({ events, center, radius }: { events: any[], center: {lat: number, lng: number}, radius: number }) {
  const [zoom, setZoom] = useState(13);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  useEffect(() => {
    if (radius <= 5) setZoom(14);
    else if (radius <= 10) setZoom(12);
    else if (radius <= 20) setZoom(11);
    else setZoom(9);
  }, [radius]);

  const createCustomIcon = (sportId: string, isSelected: boolean, isStructureEvent: boolean) => {
    const iconUrl = getSportIconUrl(sportId);
    const markerColor = isStructureEvent ? '#00F0FF' : '#CCFF00';
    
    const bgClass = isSelected 
      ? (isStructureEvent ? 'bg-[#00F0FF] text-black border-black' : 'bg-[#CCFF00] text-black border-black')
      : (isStructureEvent ? 'bg-[#16161A] text-[#00F0FF] border-[#00F0FF]' : 'bg-[#16161A] text-[#CCFF00] border-[#CCFF00]');
    
    const triangleBorder = isSelected
      ? (isStructureEvent ? 'border-t-[#00F0FF]' : 'border-t-[#CCFF00]')
      : 'border-t-[#16161A]';

    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 relative transition-colors"><div class="absolute -bottom-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] ${triangleBorder}"></div><img src="${iconUrl}" class="w-4 h-4 object-contain" /></div>`,
      className: 'bg-transparent',
      iconSize: [32, 32],
      iconAnchor: [16, 36],
      popupAnchor: [0, -36]
    });
  };

  return (
    <div className="w-full h-[calc(100vh-280px)] min-h-[400px] rounded-2xl overflow-hidden border border-[#222226] z-0 relative bg-[#0C0C0E]">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <ChangeView center={[center.lat, center.lng]} />
        <MapInteractionHandler onMapClick={() => setSelectedEvent(null)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location Marker */}
        <Marker position={[center.lat, center.lng]} icon={L.divIcon({
          html: `<div class="w-6 h-6 rounded-full bg-[#CCFF00] border-4 border-[#0C0C0E] shadow-[0_0_15px_rgba(204,255,0,0.8)] relative flex items-center justify-center"><div class="absolute inset-0 rounded-full animate-ping bg-[#CCFF00] opacity-40"></div></div>`,
          className: 'bg-transparent',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })}>
        </Marker>

        {events.map(event => {
          if(!event.latitude || !event.longitude) return null;
          const isSelected = selectedEvent?.id === event.id;
          const isStructureEvent = event.creator?.role === "ORGANIZER" || event.creator?.role === "STRUTTURA";
          return (
            <Marker 
              key={event.id} 
              position={[event.latitude, event.longitude]}
              icon={createCustomIcon(event.sport, isSelected, isStructureEvent)}
              eventHandlers={{ click: () => setSelectedEvent(event) }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Bottom Card */}
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-[#16161A] rounded-2xl shadow-2xl border border-[#222226] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-3 right-3 w-7 h-7 bg-[#222226] text-[#8E8E93] rounded-full flex items-center justify-center active:bg-[#0C0C0E] transition-colors z-10 border border-[#222226]"
          >
            <X size={14} />
          </button>
          
          {(() => {
            const isStructureEvent = selectedEvent.creator?.role === "ORGANIZER" || selectedEvent.creator?.role === "STRUTTURA";
            const accentColor = isStructureEvent ? 'text-[#00F0FF]' : 'text-[#CCFF00]';
            const btnBg = isStructureEvent 
              ? 'bg-[#00F0FF] text-black hover:bg-[#00d8e6]' 
              : 'bg-[#CCFF00] text-black hover:bg-[#b3ff00]';

            return (
              <>
                <div className="p-4 flex gap-4">
                  <div className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center shadow-sm bg-[#0C0C0E] border border-[#222226] ${accentColor}`}>
                    <img src={getSportIconUrl(selectedEvent.sport)} alt="" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-0.5">
                      {getSportDetails(selectedEvent.sport).label}
                    </span>
                    <h3 className="font-black text-white text-[16px] leading-tight line-clamp-1 mb-1">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-[11px] text-[#8E8E93] flex items-center gap-1 font-medium truncate">
                      📍 {selectedEvent.gym.name}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <div className="bg-[#0C0C0E] px-3 py-2 rounded-xl border border-[#222226] flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-[#8E8E93] font-bold uppercase mb-0.5">Data</span>
                    <span className="text-xs font-black text-white">
                      {new Date(selectedEvent.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="bg-[#0C0C0E] px-3 py-2 rounded-xl border border-[#222226] flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-[#8E8E93] font-bold uppercase mb-0.5">Ora</span>
                    <span className="text-xs font-black text-white">
                      {new Date(selectedEvent.dateStart).toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Link 
                    href={`/events/${selectedEvent.id}`} 
                    className={`rounded-xl flex items-center justify-center px-4 font-black uppercase tracking-wider text-xs shadow-sm transition-colors ${btnBg}`}
                  >
                    Vedi
                  </Link>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
