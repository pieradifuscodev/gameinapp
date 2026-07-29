"use client";

import { Check } from "lucide-react";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Felix",
  "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/micah/svg?seed=Mimi",
  "https://api.dicebear.com/9.x/micah/svg?seed=Buster",
  "https://api.dicebear.com/9.x/micah/svg?seed=Cuddles",
  "https://api.dicebear.com/9.x/micah/svg?seed=Whiskers",
  "https://api.dicebear.com/9.x/micah/svg?seed=Peanut",
  "https://api.dicebear.com/9.x/micah/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/micah/svg?seed=Coco",
  "https://api.dicebear.com/9.x/micah/svg?seed=Loki",
  "https://api.dicebear.com/9.x/micah/svg?seed=Bella",
  "https://api.dicebear.com/9.x/micah/svg?seed=Leo"
];

interface AvatarSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = value === avatar;
          return (
            <button
              key={avatar}
              type="button"
              onClick={() => onChange(avatar)}
              className={`relative w-full aspect-square rounded-full flex items-center justify-center overflow-hidden border-2 transition-all active:scale-95 ${
                isSelected 
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5" 
                  : "border-transparent bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
              
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-white rounded-full p-1 shadow-md">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
