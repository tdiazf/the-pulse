import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Settings, Edit, Dumbbell, Timer, User, Calendar, Flag, Bell, Palette, ChevronRight, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function Profile() {
  const user = useLiveQuery(() => db.userProfile.toCollection().first());
  const activities = useLiveQuery(() => db.activities.toArray());

  const totalWorkouts = activities?.length || 0;
  const totalMinutes = activities?.reduce((acc, curr) => acc + curr.duration, 0) || 0;

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos tus datos? Esta acción no se puede deshacer.')) {
      await db.userProfile.clear();
      await db.activities.clear();
      await db.goals.clear();
      await db.notifications.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight text-on-surface">Perfil</h1>
        <button className="active:scale-95 transition-transform hover:opacity-80">
          <Settings className="text-primary" size={24} />
        </button>
      </header>

      {/* Hero Profile Section */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-primary/10 border-4 border-white shadow-xl flex items-center justify-center">
            {user?.name ? (
              <img 
                className="w-full h-full object-cover" 
                alt="User profile" 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=007AFF&textColor=ffffff`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={64} className="text-primary/40" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform">
            <Edit size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">{user?.name}</h2>
          <p className="text-on-surface-variant/60 font-medium">Atleta • {user?.goal}</p>
        </div>
      </section>

      {/* Personal Records Bento Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant/40 ml-1">Récords Personales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm border border-outline/10">
            <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
              <Dumbbell className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tighter text-on-surface">{totalWorkouts}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Total ejercicios</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl flex flex-col justify-between h-40 shadow-sm border border-outline/10">
            <div className="bg-secondary/10 w-10 h-10 rounded-lg flex items-center justify-center">
              <Timer className="text-secondary" size={20} />
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tighter text-on-surface">
                {totalMinutes >= 1000 ? `${(totalMinutes / 1000).toFixed(1)}k` : totalMinutes}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Total minutos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Data Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant/40 ml-1">Datos Personales</h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-outline/10 shadow-sm">
          <ProfileItem icon={<User size={20} />} label="Nombre" value={user?.name || ''} />
          <ProfileItem icon={<Calendar size={20} />} label="Edad" value={`${user?.age} Años`} />
          <ProfileItem icon={<Users size={20} />} label="Género" value={user?.gender || 'No especificado'} />
          <ProfileItem icon={<Flag size={20} />} label="Objetivo" value={user?.goal || ''} isLast />
        </div>
      </section>

      {/* App Settings Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant/40 ml-1">Ajustes de App</h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-outline/10 shadow-sm">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="text-primary"><Bell size={20} /></div>
              <span className="font-semibold">Notificaciones</span>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-6"></div>
            </div>
          </div>
          <div className="h-px bg-surface-variant/50 ml-14"></div>
          <div className="flex items-center justify-between p-5 hover:bg-surface transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="text-primary"><Palette size={20} /></div>
              <span className="font-semibold">Apariencia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant/60 font-medium">Sistema</span>
              <ChevronRight className="text-on-surface-variant/40" size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <button 
          onClick={handleLogout}
          className="w-full bg-secondary/10 text-secondary font-bold py-4 rounded-xl active:scale-[0.98] transition-transform"
        >
          Cerrar Sesión
        </button>
      </section>
    </div>
  );
}

function ProfileItem({ icon, label, value, isLast }: { icon: React.ReactNode, label: string, value: string, isLast?: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between p-5 hover:bg-surface transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="text-primary">{icon}</div>
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-on-surface-variant/60 font-medium">{value}</span>
      </div>
      {!isLast && <div className="h-px bg-surface-variant/50 ml-14"></div>}
    </>
  );
}
