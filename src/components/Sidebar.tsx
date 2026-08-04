import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  TrendingUp,
  Package,
  Receipt,
  BarChart3,
  Server,
  Users,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance & Tracking', icon: Clock },
    { id: 'work-plan', label: 'Work Plan & MTP', icon: CalendarCheck },
    { id: 'dcr', label: 'Daily Call Reports (DCR)', icon: FileSpreadsheet },
    { id: 'sales', label: 'Sales & Primary Orders', icon: TrendingUp },
    { id: 'stock', label: 'Stock & Inventory', icon: Package },
    { id: 'expenses', label: 'Expense Claims', icon: Receipt },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'system', label: 'Backend API Status', icon: Server },
  ];

  return (
    <aside id="sidebar-root" className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
            R
          </div>
          <span className="font-bold text-white tracking-wide text-sm">RAXON SFA</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
          PROD
        </span>
      </div>

      <nav id="nav-menu" className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Core Operations
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-slate-200">System Ready</p>
              <p className="text-[10px] text-slate-400">Database & APIs online</p>
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            id="sidebar-btn-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500 hover:text-red-400" />
            <span>Sign Out Session</span>
          </button>
        )}
      </div>
    </aside>
  );
};

