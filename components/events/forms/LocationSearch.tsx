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
}

export function LocationSearch({ gyms, locationValue, onLocationSelect, error }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5">
        <MapPin size={18} className="text-primary/80" /> Luogo dell'incontro
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
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/80"
        />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        
        {isOpen && (searchValue.length > 1) && (
          <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {/* Nostre Strutture */}
            {filteredGyms.length > 0 && (
              <div className="bg-primary/10/50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-blue-800 uppercase tracking-wider border-b border-primary/20">Strutture Registrate</div>
                {filteredGyms.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => {
                      onLocationSelect(g.address, g.latitude, g.longitude, g.id);
                      setSearchValue(g.name, false);
                      clearSuggestions();
                      setIsOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm cursor-pointer hover:bg-primary/10 flex items-start gap-2 border-b border-primary/10/50 last:border-0"
                  >
                    <MapPinIcon size={16} className="text-primary/80 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-gray-900">{g.name}</div>
                      <div className="text-xs text-gray-500 truncate">{g.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Google Places */}
            {status === "OK" && (
              <div>
                {filteredGyms.length > 0 && <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-t border-gray-100">Altri Luoghi (Google Maps)</div>}
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
                    className="px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 flex items-start gap-2 border-b border-gray-50 last:border-0"
                  >
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Riepilogo selezione */}
        {locationValue && !isOpen && (
          <div className="mt-2 text-xs text-primary flex items-center gap-1 font-medium bg-primary/10 p-2 rounded-md">
            <MapPin size={14} /> Luogo confermato
          </div>
        )}
      </div>
    </div>
  );
}
