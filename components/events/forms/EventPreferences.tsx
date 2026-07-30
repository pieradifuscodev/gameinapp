"use client";

import { Trophy, Users } from "lucide-react";

interface EventPreferencesProps {
  skillLevel: string | null;
  onSkillLevelChange: (level: string | null) => void;
  genderPreference: string | null;
  onGenderPreferenceChange: (gender: string | null) => void;
  isOrganizer?: boolean;
}

export function EventPreferences({
  skillLevel,
  onSkillLevelChange,
  genderPreference,
  onGenderPreferenceChange,
  isOrganizer = false
}: EventPreferencesProps) {
  const accentColor = isOrganizer ? '#00F0FF' : '#CCFF00';
  
  const levels = ['Qualsiasi', 'Principiante', 'Intermedio', 'Avanzato'];
  const genders = ['Misto', 'Solo Uomini', 'Solo Donne'];

  return (
    <div className="bg-[#16161A] p-4 rounded-xl border border-[#222226] shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="font-black text-white mb-3 flex items-center gap-1.5 uppercase tracking-wide text-xs">
          <Trophy size={16} style={{ color: accentColor }} /> Livello Richiesto
        </h3>
        <div className="flex flex-wrap gap-2">
          {levels.map(level => {
            const isSelected = skillLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSkillLevelChange(isSelected ? null : level)}
                className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider border transition-all active:scale-95"
                style={{
                  backgroundColor: isSelected ? accentColor : '#0C0C0E',
                  color: isSelected ? '#000000' : '#8E8E93',
                  borderColor: isSelected ? accentColor : '#222226'
                }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-black text-white mb-3 flex items-center gap-1.5 uppercase tracking-wide text-xs">
          <Users size={16} style={{ color: accentColor }} /> Preferenza Genere
        </h3>
        <div className="flex flex-wrap gap-2">
          {genders.map(gender => {
            const isSelected = genderPreference === gender;
            return (
              <button
                key={gender}
                type="button"
                onClick={() => onGenderPreferenceChange(isSelected ? null : gender)}
                className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider border transition-all active:scale-95"
                style={{
                  backgroundColor: isSelected ? accentColor : '#0C0C0E',
                  color: isSelected ? '#000000' : '#8E8E93',
                  borderColor: isSelected ? accentColor : '#222226'
                }}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
