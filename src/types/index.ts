export type Intensity = 'Baja' | 'Media' | 'Alta';
export type Gender = 'Masculino' | 'Femenino' | 'Otro';

export interface UserProfile {
  id?: number;
  name: string;
  age: number;
  gender?: Gender;
  goal: string;
  dailyCalorieGoal: number;
  dailyMinuteGoal: number;
  dailyStandGoal: number;
  createdAt: Date;
}

export interface Activity {
  id?: number;
  type: string;
  duration: number; // minutes
  intensity: Intensity;
  calories: number;
  comments?: string;
  date: Date;
}

export interface Goal {
  id?: number;
  type: 'daily' | 'weekly';
  metric: 'minutes' | 'calories' | 'sessions';
  target: number;
  current: number;
  startDate: Date;
  endDate: Date;
}

export interface AppNotification {
  id?: number;
  title: string;
  message: string;
  date: Date;
  read: boolean;
}
