import React, { useState } from 'react';
import { db } from '../db';
import { UserProfile, Gender } from '../types';
import { motion } from 'motion/react';
import { Check, ChevronRight, Lock, Dumbbell, Zap, Footprints } from 'lucide-react';
import { cn } from '../lib/utils';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 0,
    gender: 'Masculino',
    goal: 'Mejorar resistencia',
    dailyCalorieGoal: 600,
    dailyMinuteGoal: 30,
    dailyStandGoal: 12,
  });

  const goals = [
    { id: 'Bajar peso', icon: <Dumbbell />, label: 'Bajar peso' },
    { id: 'Mejorar resistencia', icon: <Zap />, label: 'Mejorar resistencia' },
    { id: 'Mantenerse activo', icon: <Footprints />, label: 'Mantenerse activo' },
  ];

  const handleComplete = async () => {
    if (!formData.name) return;
    await db.userProfile.add({
      ...formData as UserProfile,
      createdAt: new Date(),
    });
    await db.notifications.add({
      title: '¡Bienvenido a The Pulse!',
      message: 'Tu perfil ha sido creado exitosamente.',
      date: new Date(),
      read: false
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-0 overflow-x-hidden">
      <main className="max-w-md w-full flex flex-col min-h-screen bg-background shadow-2xl">
        <section className="relative w-full aspect-[4/3] overflow-hidden">
          <img 
            alt="Person in athletic gear" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </section>

        <section className="px-6 -mt-12 relative z-10 flex-grow flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 mb-8"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
              ¡Hola! <span className="text-primary">Empieza</span><br/>tu viaje hoy.
            </h1>
            <p className="text-on-surface-variant/60 text-base font-medium leading-tight">
              Descubre una forma inteligente de seguir tu progreso sin complicaciones.
            </p>
          </motion.div>

          <div className="space-y-6 pb-12 flex-grow">
            <div className="bg-white rounded-xl overflow-hidden border border-outline/10 shadow-sm">
              <div className="px-4 py-3 flex items-center border-b border-outline/10 focus-within:bg-primary/5 transition-colors">
                <label className="w-24 text-[15px] font-semibold text-on-surface">Nombre</label>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[17px] p-0 placeholder:text-outline/40 focus:outline-none" 
                  placeholder="Ingresa tu nombre" 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="px-4 py-3 flex items-center border-b border-outline/10 focus-within:bg-primary/5 transition-colors">
                <label className="w-24 text-[15px] font-semibold text-on-surface">Edad</label>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[17px] p-0 placeholder:text-outline/40 focus:outline-none" 
                  placeholder="Opcional" 
                  type="number"
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="px-4 py-4 transition-colors">
                <label className="block text-[15px] font-semibold text-on-surface mb-3">Género</label>
                <div className="flex bg-surface p-1 rounded-xl border border-outline/5 w-full">
                  {(['Masculino', 'Femenino', 'Otro'] as Gender[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={cn(
                        "flex-1 py-2 text-[14px] rounded-lg transition-all", 
                        formData.gender === g 
                          ? "bg-white text-primary shadow-sm font-bold" 
                          : "text-on-surface-variant/60 font-medium active:bg-surface-variant/50"
                      )}
                      type="button"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-4 text-[13px] font-medium uppercase tracking-wider text-on-surface-variant/60">¿Cuál es tu objetivo?</label>
              <div className="bg-white rounded-xl overflow-hidden border border-outline/10 shadow-sm">
                {goals.map((goal) => (
                  <button 
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, goal: goal.id })}
                    className={cn(
                      "w-full px-4 py-4 flex items-center justify-between border-b border-outline/10 last:border-none transition-colors",
                      formData.goal === goal.id ? "bg-primary/5" : "active:bg-surface"
                    )}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary flex items-center justify-center w-6 h-6">{goal.icon}</div>
                      <span className={cn(
                        "text-[17px] font-medium text-on-surface",
                        formData.goal === goal.id && "font-semibold"
                      )}>{goal.label}</span>
                    </div>
                    {formData.goal === goal.id ? (
                      <Check className="text-primary w-6 h-6" />
                    ) : (
                      <ChevronRight className="text-outline/40 w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {!formData.name && (
                <div className="flex justify-center text-[13px] text-system-orange font-medium animate-pulse">
                  Por favor ingresa tu nombre para continuar
                </div>
              )}
              <button 
                onClick={handleComplete}
                disabled={!formData.name}
                className={cn(
                  "w-full h-[54px] bg-primary rounded-xl text-white font-bold text-[17px] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20",
                  !formData.name && "opacity-50 cursor-not-allowed"
                )}
              >
                Comenzar
              </button>
              <div className="flex items-start gap-2 px-2">
                <Lock className="text-on-surface-variant/60 w-4 h-4 mt-0.5" />
                <p className="text-on-surface-variant/60 text-[12px] leading-tight font-medium">
                  Sin registros complejos, tus datos se guardan localmente. Privacidad y velocidad ante todo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
