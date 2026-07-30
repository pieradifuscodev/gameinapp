"use client";

import { useState, useEffect } from "react";
import { MapPin, MapPinIcon } from "lucide-react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

const libraries: any = ["places"];

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchProps {
  gyms: Gym[];
  locationValue: string;
  onLocationSelect: (location: string, lat: number, lng: number, gymId: string) => void;
  error?: string;
  isOrganizer?: boolean;
}

export function LocationSearch({ gyms, locationValue, onLocationSelect, error, isOrganizer = false }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const {
    ready,
    value: searchValue,
    suggestions: { status, data: placesData },
    setValue: setSearchValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "it" },
    },
    debounce: 300,
    initOnMount: false,
  });

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [isLoaded, init]);

  // Sync external location value with search input if it changes externally
  useEffect(() => {
    if (locationValue && locationValue !== searchValue && !isOpen) {
      setSearchValue(locationValue, false);
    }
  }, [locationValue, isOpen, setSearchValue, searchValue]);

  const filteredGyms = searchValue ? gyms.filter(g => 
    g.name.toLowerCase().includes(searchValue.toLowerCase()) || 
    g.address.toLowerCase().includes(searchValue.toLowerCase())
  ) : [];

  return (
    <div className="bg-[#16161A] p-4 rounded-xl border border-[#222226] shadow-sm">
      <h3 className="font-black text-white mb-3 flex items-center gap-1.5 uppercase tracking-wide text-xs">
        <MapPin size={16} style={{ color: accentColor }} /> Luogo dell'incontro
      </h3>
      
      <div className="relative">
        <input 
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpen(true);
            // Notify parent about change, clear gymId
            onLocationSelect(e.target.value, 0, 0, "");
          }}
          onFocus={() => setIsOpen(true)}
          disabled={!ready}
          placeholder={isLoaded ? "Cerca indirizzo o struttura..." : "Caricamento mappa..."}
          className="w-full bg-[#0C0C0E] border border-[#222226] rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-[#8E8E93] focus:border-accent"
          style={{ borderColor: isOpen ? accentColor : '#222226' }}
        />
        {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
        
        {isOpen && (searchValue.length > 1) && (
          <div className="absolute z-30 mt-1.5 w-full bg-[#16161A] border border-[#222226] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {/* Nostre Strutture */}
            {filteredGyms.length > 0 && (
              <div className="bg-[#0C0C0E]/30">
                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b border-[#222226]" style={{ color: accentColor }}>Strutture Registrate</div>
                {filteredGyms.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => {
                      onLocationSelect(g.address, g.latitude, g.longitude, g.id);
                      setSearchValue(g.name, false);
                      clearSuggestions();
                      setIsOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm cursor-pointer hover:bg-[#0C0C0E]/50 flex items-start gap-2 border-b border-[#222226]/40 last:border-0"
                  >
                    <MapPinIcon size={16} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <div>
                      <div className="font-bold text-white">{g.name}</div>
                      <div className="text-xs text-[#8E8E93] truncate">{g.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Google Places */}
            {status === "OK" && (
              <div>
                {filteredGyms.length > 0 && <div className="px-3 py-2 text-[10px] font-black text-[#8E8E93] uppercase tracking-wider border-t border-[#222226]/50">Altri Luoghi (Google Maps)</div>}
                {placesData.map(({ place_id, description }) => (
                  <div 
                    key={place_id} 
                    onClick={async () => {
                      setSearchValue(description, false);
                      clearSuggestions();
                      setIsOpen(false);
                      try {
                        const results = await getGeocode({ address: description });
                        const { lat, lng } = await getLatLng(results[0]);
                        onLocationSelect(description, lat, lng, "");
                      } catch (error) {
                        console.error("Errore Geocoding: ", error);
                      }
                    }}
                    className="px-3 py-2.5 text-sm cursor-pointer hover:bg-[#0C0C0E]/50 flex items-start gap-2 border-b border-[#222226]/40 last:border-0"
                  >
                    <MapPin size={16} className="text-[#8E8E93] mt-0.5 shrink-0" />
                    <span className="text-white font-medium">{description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Riepilogo selezione */}
        {locationValue && !isOpen && (
          <div className="mt-2 text-xs flex items-center gap-1.5 font-bold p-2.5 rounded-lg" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>
            <MapPin size={14} /> Luogo confermato
          </div>
        )}
      </div>
    </div>
  );
}
