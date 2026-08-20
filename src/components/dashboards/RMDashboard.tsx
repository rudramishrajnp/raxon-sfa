import React, { useState } from 'react';
import { 
  Users, 
  Map, 
  TrendingUp, 
  Building2, 
  CheckSquare, 
  FileSpreadsheet, 
  Navigation, 
  ShieldCheck, 
  Target, 
  BarChart3, 
  ArrowRight,
  Pill,
  Award,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../data/userContext';
import { 
  RmSalesModal, 
  RmHierarchyModal, 
  RmComplianceModal, 
  RmStockistsModal 
} from './DashboardDrilldownModals';
import { RM_AREAS_BREAKDOWN } from '../../data/dashboardDrilldownData';

interface RMDashboardProps {
  user: UserProfile;
}

export function RMDashboard({ user }: RMDashboardProps) {
  const [drilldown, setDrilldown] = useState<'sales' | 'hierarchy' | 'compliance' | 'stockists' | null>(null);
  const metrics = user.metrics;
  const areas = (metrics.areasList && metrics.areasList.length > 0) ? metrics.areasList : RM_AREAS_BREAKDOWN;

  const regionalPercent = metrics.regionMonthlyTarget && metrics.regionMonthlyAchieved
    ? Math.round((metrics.regionMonthlyAchieved / metrics.regionMonthlyTarget) * 100)
    : 87;

  return (
    <div className="space-y-6">
      {/* Drilldown Modals */}
      <RmSalesModal isOpen={drilldown === 'sales'} onClose={() => setDrilldown(null)} />
      <RmHierarchyModal isOpen={drilldown === 'hierarchy'} onClose={() => setDrilldown(null)} />
      <RmComplianceModal isOpen={drilldown === 'compliance'} onClose={() => setDrilldown(null)} />
      <RmStockistsModal isOpen={drilldown === 'stockists'} onClose={() => setDrilldown(null)} />

      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Regional Manager (RM) Executive Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                Region Head Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-0.5">
              Welcome, <span className="text-purple-900 font-black">{user.name}</span> • Overseeing: <strong className="text-gray-900">{user.territory}</strong> (4 Areas, 16 MRs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <Link
            to="/reports"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Review Pack & Analytics
          </Link>
          <Link
            to="/tracking"
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            Region Field Tracking
          </Link>
        </div>
      </div>

      {/* RM Key Metrics (All Clickable with Accurate Detailed Modals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Regional Revenue Run-Rate */}
        <button
          onClick={() => setDrilldown('sales')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-purple-700 transition-colors">
              Region Sales POB
            </span>
            <TrendingUp className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-purple-950">
              ₹{((metrics.regionMonthlyAchieved || 3439200) / 100000).toFixed(2)}L
            </span>
            <span className="text-3xs text-gray-400 font-bold">
              / ₹{((metrics.regionMonthlyTarget || 3960000) / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-purple-600 h-1.5 rounded-full" 
              style={{ width: `${regionalPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-3xs font-bold text-gray-500 mt-1">
            <span>{regionalPercent}% Quota Met</span>
            <span className="text-emerald-700 font-black">+14.2% YoY</span>
          </div>
        </button>

        {/* Card 2: Regional Team Count */}
        <button
          onClick={() => setDrilldown('hierarchy')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
              Regional Hierarchy
            </span>
            <Users className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">
            4 AMs • 16 MRs
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-gray-500">
              Across 4 Operational Areas
            </span>
            <span className="text-3xs font-extrabold text-indigo-600 group-hover:underline flex items-center">
              Directory <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 3: MTP Compliance */}
        <button
          onClick={() => setDrilldown('compliance')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-800 transition-colors">
              MTP Compliance
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {metrics.regionMtpCompliance || 94.5}%
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-emerald-800">
              High Field Discipline
            </span>
            <span className="text-3xs font-extrabold text-emerald-700 group-hover:underline flex items-center">
              Audit <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 4: Authorized Stockists in Region */}
        <button
          onClick={() => setDrilldown('stockists')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-amber-800 transition-colors">
              Stockist Agencies
            </span>
            <Building2 className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{metrics.regionStockistsCount || 24} Agencies</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-amber-800">
              Liquidation Health: 98%
            </span>
            <span className="text-3xs font-extrabold text-amber-700 group-hover:underline flex items-center">
              View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Area Breakdown Table */}
      <div className="bg-white rounded-xl shadow-2xs p-5 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Area Performance Comparison & Target Run-Rate</span>
            </h2>
            <p className="text-xs text-gray-500">Secondary sales, POB orders and quota achievements per Area Manager.</p>
          </div>
          <Link
            to="/reports"
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            Export Complete Monthly Pack <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 text-3xs uppercase font-extrabold">
                <th className="py-2.5 px-3">Area Territory</th>
                <th className="py-2.5 px-3">Area Manager (AM)</th>
                <th className="py-2.5 px-3">Monthly Target</th>
                <th className="py-2.5 px-3">Achieved POB</th>
                <th className="py-2.5 px-3">Achievement %</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {areas.map((area, idx) => (
                <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-gray-900">{area.name}</td>
                  <td className="py-3 px-3 font-bold text-indigo-900">{area.amName}</td>
                  <td className="py-3 px-3 text-gray-600">₹{(area.target / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-black text-emerald-700">₹{(area.achieved / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${area.percent >= 90 ? 'bg-emerald-500' : 'bg-purple-600'}`}
                          style={{ width: `${Math.min(area.percent, 100)}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-gray-800">{area.percent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold ${
                      area.percent >= 90 ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {area.percent >= 90 ? '🌟 Star Area' : 'On Track'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
