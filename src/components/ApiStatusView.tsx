import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Database, ShieldCheck } from 'lucide-react';

export const ApiStatusView: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      } else {
        setError(`Health endpoint returned status ${res.status}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reach API server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Backend API Diagnostics & Swagger</h2>
          <p className="text-xs text-slate-500">Live monitoring for Node.js Express server endpoints and PostgreSQL database schema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchHealth}
            className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Health Check
          </button>
          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Open Swagger OpenAPI Docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Server className="w-4 h-4 text-indigo-600" /> Express REST API Engine
          </div>
          <p className="text-xs text-slate-500">Running on Node.js port 3000</p>
          
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono">
            {loading ? (
              <p className="text-slate-400">Pinging /api/health...</p>
            ) : error ? (
              <p className="text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            ) : (
              <pre className="text-emerald-700 whitespace-pre-wrap">{JSON.stringify(healthData, null, 2)}</pre>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-emerald-600" /> Database & Security Schema
          </div>
          <p className="text-xs text-slate-500">PostgreSQL / Cloud SQL schema status</p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 flex items-center justify-between font-semibold">
              <span>Auto-seeded Default Super Admin</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px]">
              Default Admin Email: <span className="text-indigo-600 font-bold">admin@raxon.com</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px]">
              Tables: users, attendance, mtp, dcr, sales, stock, expenses, chat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
