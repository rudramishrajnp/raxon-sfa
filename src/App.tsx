import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AttendanceView } from './components/AttendanceView';
import { WorkPlanView } from './components/WorkPlanView';
import { DcrView } from './components/DcrView';
import { SalesView } from './components/SalesView';
import { ExpenseView } from './components/ExpenseView';
import { ApiStatusView } from './components/ApiStatusView';
import { LoginView } from './components/LoginView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<{ email: string; name: string; role: string; token?: string } | null>(null);

  // Check if session exists in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('raxon_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('raxon_user_session');
      }
    }
  }, []);

  const handleLoginSuccess = (userData: { email: string; name: string; role: string; token?: string }) => {
    setUser(userData);
    localStorage.setItem('raxon_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('raxon_user_session');
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'attendance':
        return <AttendanceView />;
      case 'work-plan':
        return <WorkPlanView />;
      case 'dcr':
        return <DcrView />;
      case 'sales':
        return <SalesView />;
      case 'stock':
      case 'reports':
        return <DashboardView />;
      case 'expenses':
        return <ExpenseView />;
      case 'system':
        return <ApiStatusView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header activeTab={activeTab} user={user} onLogout={handleLogout} />

          <main id="main-content" className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

