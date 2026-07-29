"use client";
import { useState, useRef } from "react";
import { Camera, X, Plus } from "lucide-react";

export function MultiImageUpload({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      onChange([...value, data.url]);
    } catch (error) {
      console.error("Errore di upload", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
        {value.map((url, i) => (
          <div key={i} className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 snap-start">
            <img src={url} alt={`Struttura ${i}`} className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-28 h-28 shrink-0 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-primary/50 transition-colors snap-start"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2" />
          ) : (
            <Plus size={24} className="mb-2" />
          )}
          <span className="text-[10px] font-bold uppercase">{uploading ? "Caricamento" : "Aggiungi Foto"}</span>
        </button>
      </div>

      <input 
        type="file" 
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
