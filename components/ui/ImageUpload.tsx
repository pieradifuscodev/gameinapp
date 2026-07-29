"use client";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";

export function ImageUpload({ value, onChange }: { value: string; onChange: (base64: string) => void }) {
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Mostriamo subito una preview locale
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Carichiamo sul server
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
      
      // Passiamo l'URL pubblico (es. /uploads/hash.jpg) al componente genitore
      onChange(data.url);
      setPreview(data.url);
    } catch (error) {
      console.error("Errore di upload", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div 
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-md bg-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer group active:scale-95 transition-transform"
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Camera className="text-gray-400" size={32} />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white" size={24} />
        </div>
      </div>
      <button 
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full active:scale-95 transition-transform"
      >
        Scegli un'immagine
      </button>
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
