"use client";

import { Trophy, Users } from "lucide-react";

interface EventPreferencesProps {
  skillLevel: string | null;
  onSkillLevelChange: (level: string | null) => void;
  genderPreference: string | null;
  onGenderPreferenceChange: (gender: string | null) => void;
}

export function EventPreferences({
  skillLevel,
  onSkillLevelChange,
  genderPreference,
  onGenderPreferenceChange
}: EventPreferencesProps) {
  
  const levels = ['Qualsiasi', 'Principiante', 'Intermedio', 'Avanzato'];
  const genders = ['Misto', 'Solo Uomini', 'Solo Donne'];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5">
          <Trophy size={18} className="text-primary/80" /> Livello Richiesto
        </h3>
        <div className="flex flex-wrap gap-2">
          {levels.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => onSkillLevelChange(skillLevel === level ? null : level)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                skillLevel === level 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-gray-100 text-gray-600 bg-gray-50 active:bg-gray-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5">
          <Users size={18} className="text-primary/80" /> Preferenza Genere
        </h3>
        <div className="flex flex-wrap gap-2">
          {genders.map(gender => (
            <button
              key={gender}
              type="button"
              onClick={() => onGenderPreferenceChange(genderPreference === gender ? null : gender)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                genderPreference === gender 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-gray-100 text-gray-600 bg-gray-50 active:bg-gray-100'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
