import React, { useState, useEffect } from 'react';
import { Activity, Bell, User, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [apiStatus, setApiStatus] = useState<{ online: boolean; message: string }>({
    online: false,
    message: 'Checking API...',
  });
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setApiStatus({ online: true, message: `API Live (${data.status || 'OK'})` });
      } else {
        setApiStatus({ online: false, message: 'API Offline' });
      }
    } catch {
      setApiStatus({ online: false, message: 'API Standby' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <header id="header-root" className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 id="app-heading" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Raxon SFA Portal
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Enterprise v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-500 capitalize">{activeTab.replace('-', ' ')} Overview</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* API Health indicator */}
        <button
          id="btn-api-health"
          onClick={checkHealth}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            apiStatus.online
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
          title="Click to re-check Backend API status"
        >
          {apiStatus.online ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{apiStatus.message}</span>
          <RefreshCw className={`w-3 h-3 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <a
          id="link-swagger-docs"
          href="/api/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <span>Swagger API Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <button id="btn-notifications" className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>
          
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              SA
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Super Admin</p>
              <p className="text-[10px] text-slate-500">admin@raxon.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
