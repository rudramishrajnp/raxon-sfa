import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Activity,
  Calendar,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<string>('Connected');
  const [stats, setStats] = useState({
    activeReps: 142,
    todayCalls: 874,
    monthlyRevenue: '$482,900',
    attendanceRate: '94.8%',
  });

  return (
    <div id="dashboard-view-root" className="space-y-6">
      {/* Top Banner */}
      <div id="banner-welcome" className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-xl p-6 text-white border border-indigo-800/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Live System Operations
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Raxon Pharma Sales Operations</h2>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Real-time sales force tracking, doctor call logging, attendance verification, and distributor order processing.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            id="btn-swagger-docs"
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            Open Swagger Docs
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="card-active-reps" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Field Reps</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.activeReps}</h3>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% vs last month
            </span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div id="card-today-calls" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Today's Doctor Calls</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.todayCalls}</h3>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> 88% Target Met
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div id="card-revenue" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Monthly Primary Sales</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.monthlyRevenue}</h3>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +8.4% QoQ
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div id="card-attendance" className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.attendanceRate}</h3>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Geo-fenced verified
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Field Activity */}
        <div id="section-activity" className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Field Activity</h3>
              <p className="text-xs text-slate-500">Live DCR logs & doctor interactions</p>
            </div>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { rep: 'Dr. Rahul Sharma (Medical Rep)', target: 'Dr. A. K. Verma (Cardiologist)', time: '10 mins ago', status: 'COMPLETED', location: 'Apollo Hospital' },
              { rep: 'Priya Patel (Area Manager)', target: 'City Pharma Distributors', time: '25 mins ago', status: 'ORDER BOOKED', location: 'Central Hub' },
              { rep: 'Amit Kumar (Sales Exec)', target: 'Dr. Meena Gupta (Pediatrician)', time: '40 mins ago', status: 'SAMPLES DELIVERED', location: 'Lifeline Clinic' },
              { rep: 'Sanjay Singh (Territory Mgr)', target: 'Metro Healthcare Pharmacy', time: '1 hour ago', status: 'STOCK AUDITED', location: 'East Wing' }
            ].map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                    {act.rep[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{act.rep}</p>
                    <p className="text-[11px] text-slate-500">Visited <span className="text-slate-700 font-medium">{act.target}</span> • {act.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {act.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backend Modules Overview */}
        <div id="section-modules" className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Backend Services Status</h3>
          <p className="text-xs text-slate-500 mb-4">REST API modules initialized in server.ts</p>

          <div className="space-y-2.5">
            {[
              { name: 'Auth & RBAC Service', path: '/api/auth', status: 'Online' },
              { name: 'Attendance & Tracking', path: '/api/attendance', status: 'Online' },
              { name: 'Work Plan & MTP', path: '/api/work-plan', status: 'Online' },
              { name: 'Daily Call Reports (DCR)', path: '/api/dcr', status: 'Online' },
              { name: 'Sales & Inventory', path: '/api/sales', status: 'Online' },
              { name: 'Expense Approvals', path: '/api/expense', status: 'Online' },
            ].map((mod, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{mod.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{mod.path}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
