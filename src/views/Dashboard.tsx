import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { motion } from 'motion/react';
import { Timer, Dumbbell, ChevronRight, Activity, Footprints, Bike, Flower2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../App';
import { format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const user = useLiveQuery(() => db.userProfile.toCollection().first());
  const activities = useLiveQuery(() => db.activities.orderBy('date').reverse().limit(5).toArray());
  const todayActivities = useLiveQuery(() => 
    db.activities.where('date').between(
      new Date(new Date().setHours(0,0,0,0)), 
      new Date(new Date().setHours(23,59,59,999))
    ).toArray()
  );

  const stats = {
    calories: todayActivities?.reduce((acc, curr) => acc + curr.calories, 0) || 0,
    minutes: todayActivities?.reduce((acc, curr) => acc + curr.duration, 0) || 0,
    sessions: todayActivities?.length || 0,
  };

  const calorieProgress = Math.min(100, (stats.calories / (user?.dailyCalorieGoal || 600)) * 100);
  const minuteProgress = Math.min(100, (stats.minutes / (user?.dailyMinuteGoal || 30)) * 100);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Correr': return <Activity className="text-white" />;
      case 'Caminar': return <Footprints className="text-white" />;
      case 'Gym': return <Dumbbell className="text-white" />;
      case 'Ciclismo': return <Bike className="text-white" />;
      case 'Yoga': return <Flower2 className="text-white" />;
      default: return <Activity className="text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Correr': return 'bg-system-green';
      case 'Caminar': return 'bg-system-orange';
      case 'Gym': return 'bg-system-purple';
      case 'Ciclismo': return 'bg-system-blue';
      case 'Yoga': return 'bg-system-pink';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-0.5 px-1">
        <h2 className="font-headline font-bold text-3xl tracking-tight text-on-surface">
          Hola, {user?.name.split(' ')[0]} 👋
        </h2>
        <p className="font-body text-on-surface-variant/60 text-base font-medium">
          ¡Tu progreso hoy es increíble!
        </p>
      </section>

      {/* Activity Rings Widget */}
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm border border-outline/10">
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-system-pink">MOVERSE</span>
            <span className="text-xl font-bold">{stats.calories}/{user?.dailyCalorieGoal} <span className="text-on-surface-variant/60 font-medium">KCAL</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-system-green">EJERCICIO</span>
            <span className="text-xl font-bold">{stats.minutes}/{user?.dailyMinuteGoal} <span className="text-on-surface-variant/60 font-medium">MIN</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-system-teal">SESIONES</span>
            <span className="text-xl font-bold">{stats.sessions}/3 <span className="text-on-surface-variant/60 font-medium">SES</span></span>
          </div>
        </div>
        
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-system-pink/10" cx="72" cy="72" fill="transparent" r="56" stroke="currentColor" strokeWidth="14" />
            <motion.circle 
              initial={{ strokeDashoffset: 351.8 }}
              animate={{ strokeDashoffset: 351.8 - (351.8 * calorieProgress / 100) }}
              className="text-system-pink" cx="72" cy="72" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeLinecap="round" strokeWidth="14" 
            />
            
            <circle className="text-system-green/10" cx="72" cy="72" fill="transparent" r="41" stroke="currentColor" strokeWidth="14" />
            <motion.circle 
              initial={{ strokeDashoffset: 257.6 }}
              animate={{ strokeDashoffset: 257.6 - (257.6 * minuteProgress / 100) }}
              className="text-system-green" cx="72" cy="72" fill="transparent" r="41" stroke="currentColor" strokeDasharray="257.6" strokeLinecap="round" strokeWidth="14" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-2xl text-on-surface">
              {Math.round((calorieProgress + minuteProgress) / 2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Small Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm border border-outline/10">
          <div className="w-8 h-8 rounded-full bg-system-orange/10 flex items-center justify-center text-system-orange">
            <Timer size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{stats.minutes}</p>
            <p className="text-xs font-semibold text-on-surface-variant/60 uppercase mt-1">Minutos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between h-32 shadow-sm border border-outline/10">
          <div className="w-8 h-8 rounded-full bg-system-purple/10 flex items-center justify-center text-system-purple">
            <Dumbbell size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{stats.sessions}</p>
            <p className="text-xs font-semibold text-on-surface-variant/60 uppercase mt-1">Sesiones</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-headline font-bold text-xl text-on-surface">Actividades</h3>
          <button onClick={() => onNavigate('stats')} className="text-primary font-semibold text-sm">Ver todo</button>
        </div>
        
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-outline/5 shadow-sm border border-outline/10">
          {activities === undefined ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Activity className="text-primary w-8 h-8" />
              </div>
              <p className="text-[17px] font-semibold text-on-surface">¡Comienza tu viaje!</p>
              <p className="text-[14px] text-on-surface-variant/60 max-w-[200px]">
                Registra tu primer entrenamiento para empezar a ver tus estadísticas.
              </p>
            </div>
          ) : (
            activities?.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 active:bg-surface transition-colors">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getActivityColor(activity.type))}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-bold text-[17px] text-on-surface">{activity.type}</p>
                  <p className="text-sm text-on-surface-variant/60">
                    {isToday(activity.date) ? 'Hoy' : isYesterday(activity.date) ? 'Ayer' : format(activity.date, 'd MMM', { locale: es })}, {format(activity.date, 'HH:mm')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[17px] text-on-surface">{activity.duration} min</p>
                  <p className="text-xs text-on-surface-variant/60">{activity.calories} kcal</p>
                </div>
                <ChevronRight className="text-outline/40 ml-2" size={20} />
              </div>
            ))
          )}
        </div>
      </section>

      <div className="flex justify-center pt-2">
        <button 
          onClick={() => onNavigate('register')}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Registrar Actividad
        </button>
      </div>
    </div>
  );
}
