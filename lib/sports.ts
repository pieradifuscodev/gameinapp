export const SPORTS = [
  { id: "CALCIO", label: "Calcio", imageId: "calcio", icon: "⚽️", color: "bg-[#1f4a23]", waveColor: "text-[#123116]", shapeColor: "bg-[#4ade80]/20", pillColor: "bg-[#1f4a23]", pillText: "text-white" },
  { id: "CALCETTO", label: "Calcetto", imageId: "calcetto", icon: "⚽️", color: "bg-[#0d9488]", waveColor: "text-[#0f766e]", shapeColor: "bg-[#5eead4]/20", pillColor: "bg-[#0d9488]", pillText: "text-white" },
  { id: "RUNNING", label: "Running", imageId: "corsa", icon: "🏃‍♂️", color: "bg-[#d34742]", waveColor: "text-[#b2322d]", shapeColor: "bg-[#f87171]/20", pillColor: "bg-[#d34742]", pillText: "text-white" },
  { id: "YOGA", label: "Yoga", imageId: "yoga", icon: "🧘‍♀️", color: "bg-[#fd84b2]", waveColor: "text-[#e86095]", shapeColor: "bg-[#fbcfe8]/40", pillColor: "bg-[#fd84b2]", pillText: "text-white" },
  { id: "BALLO", label: "Ballo", imageId: "ballo", icon: "💃", color: "bg-[#f55a8e]", waveColor: "text-[#d1376b]", shapeColor: "bg-[#f9a8d4]/40", pillColor: "bg-[#f55a8e]", pillText: "text-white" },
  { id: "NUOTO", label: "Nuoto", imageId: "nuoto", icon: "🏊‍♂️", color: "bg-[#3f6d78]", waveColor: "text-[#274b54]", shapeColor: "bg-[#67e8f9]/20", pillColor: "bg-[#3f6d78]", pillText: "text-white" },
  { id: "PALLAVOLO", label: "Pallavolo", imageId: "pallavolo", icon: "🏐", color: "bg-[#ffc634]", waveColor: "text-[#e6a210]", shapeColor: "bg-[#fef08a]/40", pillColor: "bg-[#ffc634]", pillText: "text-gray-900" },
  { id: "BASKET", label: "Basket", imageId: "basketball", icon: "🏀", color: "bg-[#bf591f]", waveColor: "text-[#984313]", shapeColor: "bg-[#fb923c]/20", pillColor: "bg-[#bf591f]", pillText: "text-white" },
  { id: "GINNASTICA", label: "Ginnastica", imageId: "ginnastica", icon: "🤸‍♀️", color: "bg-[#222222]", waveColor: "text-[#10b981]", shapeColor: "bg-[#34d399]/20", pillColor: "bg-[#222222]", pillText: "text-white" },
  { id: "ARTI_MARZIALI", label: "Arti Marziali", imageId: "arti-marziali", icon: "🥋", color: "bg-[#710000]", waveColor: "text-[#4a0000]", shapeColor: "bg-[#ef4444]/20", pillColor: "bg-[#710000]", pillText: "text-white" },
  { id: "HIP_HOP", label: "Hip Hop", imageId: "hip-hop", icon: "🎧", color: "bg-[#787878]", waveColor: "text-[#404040]", shapeColor: "bg-[#e5e7eb]/20", pillColor: "bg-[#787878]", pillText: "text-white" },
  { id: "PADEL", label: "Padel", imageId: "padel", icon: "🏸", color: "bg-[#0ea5e9]", waveColor: "text-[#0284c7]", shapeColor: "bg-[#7dd3fc]/20", pillColor: "bg-[#0ea5e9]", pillText: "text-white" },
  { id: "TENNIS", label: "Tennis", imageId: "tennis", icon: "🎾", color: "bg-[#84cc16]", waveColor: "text-[#65a30d]", shapeColor: "bg-[#bef264]/20", pillColor: "bg-[#84cc16]", pillText: "text-white" },
  { id: "BEACH_VOLLEY", label: "Beach Volley", imageId: "beach-volley", icon: "🏖️", color: "bg-[#f59e0b]", waveColor: "text-[#d97706]", shapeColor: "bg-[#fcd34d]/20", pillColor: "bg-[#f59e0b]", pillText: "text-white" },
  { id: "CICLISMO", label: "Ciclismo", imageId: "ciclismo", icon: "🚴‍♂️", color: "bg-[#8b5cf6]", waveColor: "text-[#6d28d9]", shapeColor: "bg-[#c4b5fd]/20", pillColor: "bg-[#8b5cf6]", pillText: "text-white" },
];

export function getSportDetails(sportId: string) {
  return SPORTS.find(s => s.id === sportId) || {
    id: sportId,
    label: sportId,
    imageId: "calcio",
    icon: "🏅",
    color: "bg-gray-500",
    waveColor: "text-gray-600",
    shapeColor: "bg-gray-300/20",
    pillColor: "bg-gray-500",
    pillText: "text-white"
  };
}
