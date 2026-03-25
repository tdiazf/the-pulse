import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timer, TrendingUp, Bolt, Activity, Dumbbell, Flower2, Bike, Footprints, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function Stats() {
  const user = useLiveQuery(() => db.userProfile.toCollection().first());
  const allActivities = useLiveQuery(() => db.activities.orderBy('date').reverse().toArray());

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const chartData = days.map(day => {
    const dayActivities = allActivities?.filter(a => isSameDay(a.date, day)) || [];
    return {
      name: format(day, 'E', { locale: es }).charAt(0).toUpperCase(),
      minutes: dayActivities.reduce((acc, curr) => acc + curr.duration, 0),
      fullDate: day
    };
  });

  const weeklyMinutes = allActivities?.filter(a => a.date >= weekStart && a.date <= weekEnd)
    .reduce((acc, curr) => acc + curr.duration, 0) || 0;
  
  const weeklyGoal = user?.dailyMinuteGoal ? user.dailyMinuteGoal * 7 : 150;
  const progressPercent = Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Correr': return <Activity size={24} />;
      case 'Caminar': return <Footprints size={24} />;
      case 'Gym': return <Dumbbell size={24} />;
      case 'Ciclismo': return <Bike size={24} />;
      case 'Yoga': return <Flower2 size={24} />;
      default: return <Activity size={24} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Correr': return 'bg-system-green/10 text-system-green';
      case 'Caminar': return 'bg-system-orange/10 text-system-orange';
      case 'Gym': return 'bg-primary/10 text-primary';
      case 'Ciclismo': return 'bg-system-blue/10 text-system-blue';
      case 'Yoga': return 'bg-system-pink/10 text-system-pink';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-[34px] font-bold tracking-tight text-on-surface">Resumen</h1>
        <p className="text-[15px] text-on-surface-variant/60 font-medium">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </section>

      <div className="space-y-4">
        {/* Weekly Progress Card */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-outline/10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Timer className="text-primary" size={20} />
              <h2 className="text-[15px] font-semibold text-on-surface-variant/60 uppercase tracking-wide">Minutos de Ejercicio</h2>
            </div>
            <span className="text-[15px] text-on-surface-variant/60">Esta semana</span>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[34px] font-bold">{weeklyMinutes}</span>
            <span className="text-[17px] text-on-surface-variant/60 font-medium">/ {weeklyGoal} min</span>
          </div>
          <div className="relative h-2 w-full bg-surface rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[13px] text-on-surface-variant/60">
            Llevas un <span className="text-primary font-semibold">{progressPercent}%</span> de tu meta semanal.
          </p>
        </section>

        {/* Intensity Score Card */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-outline/10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-system-green" size={20} />
            <h2 className="text-[15px] font-semibold text-on-surface-variant/60 uppercase tracking-wide">Intensidad Hoy</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[28px] font-bold text-system-green">Excelente</p>
              <p className="text-[15px] text-on-surface-variant/60 mt-1">+12% vs. semana pasada</p>
            </div>
            <div className="w-16 h-16 rounded-full border-[6px] border-system-green flex items-center justify-center">
              <Bolt className="text-system-green" size={24} />
            </div>
          </div>
        </section>
      </div>

      {/* Weekly Activity Chart */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-outline/10">
        <h3 className="text-[17px] font-bold mb-6">Actividad Semanal</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 500, fill: '#8E8E93' }} 
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 rounded-lg shadow-lg border border-outline/10 text-xs font-bold">
                        {payload[0].value} min
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={isSameDay(entry.fullDate, new Date()) ? '#007AFF' : '#007AFF20'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Activity History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[20px] font-bold">Actividad Reciente</h3>
        </div>
        <div className="bg-white rounded-xl divide-y divide-outline/5 border border-outline/10 overflow-hidden shadow-sm">
          {allActivities === undefined ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            </div>
          ) : allActivities.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-surface-variant/50 flex items-center justify-center mb-1">
                <Timer className="text-on-surface-variant/50 w-8 h-8" />
              </div>
              <p className="text-[17px] font-semibold text-on-surface">Aún no hay historial</p>
              <p className="text-[14px] text-on-surface-variant/60">
                Tus actividades aparecerán aquí.
              </p>
            </div>
          ) : (
            allActivities?.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 active:bg-surface transition-colors cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getActivityColor(activity.type))}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[17px] font-semibold text-on-surface">{activity.type}</h4>
                    <div className="text-right">
                      <p className="text-[17px] font-bold text-primary">{activity.duration} min</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-on-surface-variant/60">
                    {format(activity.date, "d MMM, HH:mm", { locale: es })} • {activity.intensity}
                  </p>
                </div>
                <ChevronRight className="text-outline/40" size={20} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
