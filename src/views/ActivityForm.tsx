import React, { useState } from 'react';
import { db } from '../db';
import { Intensity } from '../types';
import { motion } from 'motion/react';
import { Dumbbell, Bike, Flower2, Info, Zap, Footprints, Activity } from 'lucide-react';
import { cn, calculateCalories } from '../lib/utils';

interface ActivityFormProps {
  onComplete: () => void;
}

export function ActivityForm({ onComplete }: ActivityFormProps) {
  const [type, setType] = useState('Correr');
  const [duration, setDuration] = useState(0);
  const [intensity, setIntensity] = useState<Intensity>('Media');
  const [comments, setComments] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const exerciseTypes = [
    { id: 'Correr', icon: <Activity />, label: 'Correr' },
    { id: 'Caminar', icon: <Footprints />, label: 'Caminar' },
    { id: 'Gym', icon: <Dumbbell />, label: 'Gym' },
    { id: 'Ciclismo', icon: <Bike />, label: 'Ciclismo' },
    { id: 'Yoga', icon: <Flower2 />, label: 'Yoga' },
  ];

  const handleSave = async () => {
    if (duration <= 0) return;
    setIsSaving(true);
    
    try {
      await db.activities.add({
        type,
        duration,
        intensity,
        calories: calculateCalories(type, duration, intensity),
        comments,
        date: new Date(),
      });
      await db.notifications.add({
        title: '¡Buen trabajo!',
        message: `Completaste ${duration} min de ${type}.`,
        date: new Date(),
        read: false
      });
      setIsSuccess(true);
      setTimeout(() => onComplete(), 1500);
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-1">
        <h1 className="font-headline font-bold text-[34px] leading-tight tracking-tight text-on-surface">Nueva Actividad</h1>
        <p className="text-on-surface-variant/60 text-[17px]">Registra tu progreso de hoy.</p>
      </section>

      <div className="space-y-6">
        {/* Exercise Type */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-on-surface-variant/60 uppercase tracking-wide px-1">¿QUÉ HICISTE?</label>
          <div className="grid grid-cols-5 gap-2">
            {exerciseTypes.map((item) => (
              <button 
                key={item.id}
                onClick={() => setType(item.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all active:scale-95",
                  type === item.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white text-primary border border-outline/10 shadow-sm"
                )}
                type="button"
              >
                {item.icon}
                <span className={cn(
                  "text-[11px] font-medium",
                  type === item.id ? "text-white" : "text-on-surface"
                )}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-outline/10 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[15px] font-semibold text-on-surface">Duración</label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{duration}</span>
              <span className="text-[13px] font-medium text-on-surface-variant/60">MIN</span>
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            {[5, 15, 30].map(mins => (
              <button
                key={mins}
                onClick={() => setDuration(Math.min(120, duration + mins))}
                className="flex-1 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold active:scale-95 transition-transform"
                type="button"
              >
                +{mins}m
              </button>
            ))}
          </div>
          <div className="relative pt-2 pb-4">
            <input 
              className="w-full accent-primary h-1 bg-surface rounded-full appearance-none cursor-pointer" 
              max="120" 
              min="0" 
              type="range" 
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
            <div className="flex justify-between mt-2 text-[11px] font-medium text-on-surface-variant/40">
              <span>0m</span>
              <span>120m</span>
            </div>
          </div>
          {duration === 0 && (
            <div className="flex items-center gap-1.5 text-red-500 text-[13px] font-medium">
              <Info size={14} />
              La duración debe ser mayor a 0
            </div>
          )}
        </div>

        {/* Intensity Segmented Control */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-on-surface-variant/60 uppercase tracking-wide px-1">INTENSIDAD</label>
          <div className="flex bg-surface-variant/50 p-0.5 rounded-xl border border-outline/10">
            {(['Baja', 'Media', 'Alta'] as Intensity[]).map((level) => (
              <button 
                key={level}
                onClick={() => setIntensity(level)}
                className={cn(
                  "flex-1 py-2 text-[13px] font-medium rounded-lg transition-all",
                  intensity === level 
                    ? "bg-white text-on-surface shadow-sm font-semibold" 
                    : "text-on-surface-variant/60 active:opacity-70"
                )}
                type="button"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <label className="text-[13px] font-medium text-on-surface-variant/60 uppercase tracking-wide px-1">COMENTARIOS (OPCIONAL)</label>
          <textarea 
            className="w-full bg-white border border-outline/10 rounded-xl p-4 text-[17px] text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 focus:outline-none shadow-sm" 
            placeholder="¿Cómo te sentiste hoy?" 
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Guardar Button */}
        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={duration <= 0 || isSaving || isSuccess}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-[17px] transition-all shadow-lg flex justify-center items-center",
              isSuccess
                ? "bg-system-green text-white shadow-system-green/20"
                : duration > 0 && !isSaving
                  ? "bg-primary text-white shadow-primary/20 active:scale-95" 
                  : "bg-primary/20 text-primary cursor-not-allowed"
            )}
            type="button"
          >
            {isSuccess ? '¡Guardado exitosamente!' : isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
