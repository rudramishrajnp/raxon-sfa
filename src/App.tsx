import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AttendanceView } from './components/AttendanceView';
import { WorkPlanView } from './components/WorkPlanView';
import { DcrView } from './components/DcrView';
import { SalesView } from './components/SalesView';
import { ExpenseView } from './components/ExpenseView';
import { ApiStatusView } from './components/ApiStatusView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header activeTab={activeTab} />

          <main id="main-content" className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
