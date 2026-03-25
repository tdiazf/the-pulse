import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCalories(type: string, duration: number, intensity: string): number {
  const metValues: Record<string, number> = {
    'Correr': 8,
    'Caminar': 3.5,
    'Gym': 5,
    'Ciclismo': 7.5,
    'Yoga': 2.5,
    'default': 4
  };
  
  const intensityMultiplier: Record<string, number> = {
    'Baja': 0.8,
    'Media': 1,
    'Alta': 1.3
  };

  const met = metValues[type] || metValues.default;
  const mult = intensityMultiplier[intensity] || 1;
  
  // Rough estimate: MET * 3.5 * weight(kg) / 200 * duration
  // Assuming average weight of 70kg
  return Math.round(met * mult * 3.5 * 70 / 200 * duration);
}
