import { 
  Trophy, 
  Target, 
  Activity, 
  Wind, 
  Flame, 
  Zap, 
  Dumbbell, 
  Medal,
  Bike,
  type LucideIcon 
} from "lucide-react";

export const sportIconMap: Record<string, LucideIcon> = {
  CALCIO: Trophy,
  CALCETTO: Target,
  RUNNING: Activity,
  YOGA: Wind,
  BALLO: Flame,
  PALLAVOLO: Zap,
  BASKET: Target,
  GINNASTICA: Dumbbell,
  PADEL: Zap,
  TENNIS: Target,
  BEACH_VOLLEY: Zap,
  CICLISMO: Bike,
};

export function SportIcon({ sportId, className, size = 18 }: { sportId: string, className?: string, size?: number }) {
  const Icon = sportIconMap[sportId] || Trophy;
  return <Icon size={size} className={className} />;
}
