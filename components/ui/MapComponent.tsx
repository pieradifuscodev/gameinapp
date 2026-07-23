"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { getSportDetails } from "@/lib/sports";
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

  const createCustomIcon = (sportId: string, isSelected: boolean) => {
    const sport = getSportDetails(sportId);
    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full ${isSelected ? 'bg-slate-900 text-white' : sport.pillColor + ' ' + sport.pillText} flex items-center justify-center font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-2 border-white relative transition-colors"><div class="absolute -bottom-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-white"></div>${sport.icon || '📍'}</div>`,
      className: 'bg-transparent',
      iconSize: [32, 32],
      iconAnchor: [16, 36],
      popupAnchor: [0, -36]
    });
  };

  return (
    <div className="w-full h-[calc(100vh-280px)] min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 z-0 relative bg-slate-50">
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
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* User Location Marker */}
        <Marker position={[center.lat, center.lng]} icon={L.divIcon({
          html: `<div class="w-5 h-5 rounded-full bg-slate-900 border-[3px] border-white shadow-md relative flex items-center justify-center"><div class="absolute inset-0 rounded-full animate-ping bg-slate-900 opacity-30"></div></div>`,
          className: 'bg-transparent',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })}>
        </Marker>

        {events.map(event => {
          if(!event.latitude || !event.longitude) return null;
          const isSelected = selectedEvent?.id === event.id;
          return (
            <Marker 
              key={event.id} 
              position={[event.latitude, event.longitude]}
              icon={createCustomIcon(event.sport, isSelected)}
              eventHandlers={{ click: () => setSelectedEvent(event) }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Bottom Card */}
      {selectedEvent && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-3 right-3 w-7 h-7 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center active:bg-slate-200 transition-colors z-10"
          >
            <X size={14} />
          </button>
          
          <div className="p-4 flex gap-4">
            <div className={`w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-3xl shadow-sm ${getSportDetails(selectedEvent.sport).pillColor}`}>
              {getSportDetails(selectedEvent.sport).icon}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                {getSportDetails(selectedEvent.sport).label}
              </span>
              <h3 className="font-bold text-slate-900 text-[16px] leading-tight line-clamp-1 mb-1">
                {selectedEvent.title}
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium truncate">
                📍 {selectedEvent.gym.name}
              </p>
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex-1 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Data</span>
              <span className="text-xs font-bold text-slate-900">
                {new Date(selectedEvent.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex-1 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Ora</span>
              <span className="text-xs font-bold text-slate-900">
                {new Date(selectedEvent.dateStart).toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <Link 
              href={`/events/${selectedEvent.id}`} 
              className="bg-slate-900 text-white rounded-xl flex items-center justify-center px-4 font-bold text-sm shadow-sm active:bg-slate-800 transition-colors"
            >
              Vedi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
