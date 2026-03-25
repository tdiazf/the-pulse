import React, { useState } from 'react';
import { Home, PlusCircle, BarChart2, User, Bell } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { cn } from '../lib/utils';
import { View } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

export function Layout({ children, currentView, setView }: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = useLiveQuery(() => db.notifications.orderBy('date').reverse().limit(10).toArray());
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleNotificationsClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      const unread = notifications?.filter(n => !n.read) || [];
      for (const n of unread) {
        if (n.id) await db.notifications.update(n.id, { read: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans pb-24 relative">
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-outline/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-primary font-bold text-lg tracking-tight">The Pulse</span>
        </div>
        <button 
          onClick={handleNotificationsClick}
          className="text-primary hover:opacity-70 transition-opacity"
        >
          <div className="relative mt-1">
            <Bell size={24} />
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-system-orange rounded-full border-[1.5px] border-white animate-pulse" />
            )}
          </div>
        </button>

        {showNotifications && (
          <div className="absolute top-16 right-6 w-80 bg-white rounded-2xl shadow-xl border border-outline/10 overflow-hidden z-[60]">
            <div className="p-4 border-b border-outline/10 bg-surface/50">
              <h3 className="font-bold text-[17px]">Notificaciones</h3>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-outline/5">
              {!notifications || notifications.length === 0 ? (
                <div className="p-6 text-center text-on-surface-variant/50 text-[14px]">
                  No tienes notificaciones
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={cn("p-4 transition-colors", !n.read ? "bg-primary/5" : "")}>
                    <p className="font-semibold text-[15px]">{n.title}</p>
                    <p className="text-[14px] text-on-surface-variant/80 mt-1">{n.message}</p>
                    <p className="text-[11px] text-on-surface-variant/40 mt-2 uppercase font-medium tracking-wide">
                      {n.date.toLocaleDateString()} a las {n.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </header>

      <main className="pt-20 px-6 max-w-2xl mx-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-t border-outline/10 pt-3 pb-8 px-8 flex justify-between items-center rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <NavButton 
          active={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')} 
          icon={<Home size={24} />} 
          label="Inicio" 
        />
        <NavButton 
          active={currentView === 'register'} 
          onClick={() => setView('register')} 
          icon={<PlusCircle size={24} />} 
          label="Registrar" 
        />
        <NavButton 
          active={currentView === 'stats'} 
          onClick={() => setView('stats')} 
          icon={<BarChart2 size={24} />} 
          label="Estadísticas" 
        />
        <NavButton 
          active={currentView === 'profile'} 
          onClick={() => setView('profile')} 
          icon={<User size={24} />} 
          label="Perfil" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all active:scale-90",
        active ? "text-primary" : "text-on-surface-variant/50"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
