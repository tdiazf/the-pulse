import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { ActivityForm } from './views/ActivityForm';
import { Stats } from './views/Stats';
import { Profile } from './views/Profile';
import { Layout } from './components/Layout';

export type View = 'dashboard' | 'register' | 'stats' | 'profile';

export default function App() {
  const users = useLiveQuery(() => db.userProfile.toArray());
  const user = users?.[0];
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (users !== undefined) {
      setIsInitialized(true);
    }
  }, [users]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">The Pulse</div>
      </div>
    );
  }

  if (!user) {
    return <Onboarding />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'register': return <ActivityForm onComplete={() => setCurrentView('dashboard')} />;
      case 'stats': return <Stats />;
      case 'profile': return <Profile />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
