import { List as ListIcon, Map as MapIcon } from "lucide-react";

interface MapToggleButtonProps {
  isMapView: boolean;
  onToggle: () => void;
}

export default function MapToggleButton({ isMapView, onToggle }: MapToggleButtonProps) {
  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] right-4 z-[50]">
      <button 
        onClick={onToggle}
        className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-slate-700"
        aria-label={isMapView ? "Mostra Elenco" : "Mappa"}
      >
        {isMapView ? (
          <ListIcon size={24} />
        ) : (
          <MapIcon size={24} />
        )}
      </button>
    </div>
  );
}
