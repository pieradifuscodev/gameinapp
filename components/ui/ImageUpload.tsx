"use client";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";

export function ImageUpload({ value, onChange }: { value: string; onChange: (base64: string) => void }) {
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
