"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { getSportDetails } from "@/lib/sports";
import { Navigation } from "lucide-react";

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

export default function MapComponent({ events, center, radius }: { events: any[], center: {lat: number, lng: number}, radius: number }) {
  const [zoom, setZoom] = useState(13);
  
  useEffect(() => {
    if (radius <= 5) setZoom(14);
    else if (radius <= 10) setZoom(12);
    else if (radius <= 20) setZoom(11);
    else setZoom(9);
  }, [radius]);

  const createCustomIcon = (sportId: string) => {
    const sport = getSportDetails(sportId);
    return L.divIcon({
      html: `<div class="w-8 h-8 rounded-full ${sport.pillColor} ${sport.pillText} flex items-center justify-center font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-2 border-white relative"><div class="absolute -bottom-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[6px] border-t-white"></div>${sport.icon || '📍'}</div>`,
      className: 'bg-transparent',
      iconSize: [32, 32],
      iconAnchor: [16, 36],
      popupAnchor: [0, -36]
    });
  };

  return (
    <div className="w-full h-[calc(100vh-280px)] min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <ChangeView center={[center.lat, center.lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        <Marker position={[center.lat, center.lng]} icon={L.divIcon({
          html: `<div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_10px_rgba(37,99,235,0.8)] relative flex items-center justify-center"><div class="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-70"></div></div>`,
          className: 'bg-transparent',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })}>
          <Popup>
            <div className="font-bold text-center">La tua posizione</div>
          </Popup>
        </Marker>

        {events.map(event => {
          if(!event.latitude || !event.longitude) return null;
          const sport = getSportDetails(event.sport);
          return (
            <Marker 
              key={event.id} 
              position={[event.latitude, event.longitude]}
              icon={createCustomIcon(event.sport)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden">
                <div className="flex flex-col min-w-[200px] -m-[13px]">
                  <div className={`p-3 ${sport.color} text-white flex justify-between items-start`}>
                    <div>
                      <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1 border border-white/20">
                        {sport.label}
                      </span>
                      <h3 className="font-bold text-base leading-tight m-0 drop-shadow-sm">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1 font-medium">
                      <Navigation size={12} className="text-gray-400" />
                      {event.gym.name}
                    </p>
                    <p className="text-xs font-bold text-gray-800 mb-3">{new Date(event.dateStart).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    
                    <Link href={`/events/${event.id}`} className="bg-blue-600 text-white text-center py-2 rounded-xl text-xs font-bold block shadow-md hover:bg-blue-700 transition-colors">
                      Vedi Dettagli
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
