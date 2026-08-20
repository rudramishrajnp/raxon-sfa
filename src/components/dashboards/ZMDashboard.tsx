import React, { useState } from 'react';
import { 
  Users, 
  Map, 
  TrendingUp, 
  Building2, 
  Target, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers, 
  Award, 
  Globe, 
  PieChart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../data/userContext';
import { 
  ZmRevenueModal, 
  ZmDivisionsModal, 
  RmStockistsModal, 
  ZmFieldForceModal 
} from './DashboardDrilldownModals';

interface ZMDashboardProps {
  user: UserProfile;
}

export function ZMDashboard({ user }: ZMDashboardProps) {
  const [drilldown, setDrilldown] = useState<'revenue' | 'divisions' | 'stockists' | 'fieldforce' | null>(null);
  const metrics = user.metrics;
  const regions = metrics.zoneRegionsList || [];

  const zoneAchievedPercent = metrics.zoneRevenueTarget && metrics.zoneRevenueAchieved
    ? Math.round((metrics.zoneRevenueAchieved / metrics.zoneRevenueTarget) * 100)
    : 90;

  return (
    <div className="space-y-6">
      {/* Drilldown Modals */}
      <ZmRevenueModal isOpen={drilldown === 'revenue'} onClose={() => setDrilldown(null)} />
      <ZmDivisionsModal isOpen={drilldown === 'divisions'} onClose={() => setDrilldown(null)} />
      <RmStockistsModal isOpen={drilldown === 'stockists'} onClose={() => setDrilldown(null)} />
      <ZmFieldForceModal isOpen={drilldown === 'fieldforce'} onClose={() => setDrilldown(null)} />

      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Zonal Manager (ZM) Strategic Command Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
                Zonal Command Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-0.5">
              Welcome, <span className="text-emerald-950 font-black">{user.name}</span> • Strategic Command: <strong className="text-gray-900">{user.territory}</strong> (4 Regions, 84 Field Force)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <Link
            to="/reports"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Zonal Analytics Pack
          </Link>
          <Link
            to="/tracking"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            Zonal Field Coverage
          </Link>
        </div>
      </div>

      {/* Zonal Key Metrics (All Clickable with Accurate Detailed Modals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Zone Revenue Quota */}
        <button
          onClick={() => setDrilldown('revenue')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-800 transition-colors">
              Zonal Total Revenue
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-950">
              ₹{((metrics.zoneRevenueAchieved || 14820000) / 10000000).toFixed(2)} Cr
            </span>
            <span className="text-3xs text-gray-400 font-bold">
              / ₹{((metrics.zoneRevenueTarget || 16500000) / 10000000).toFixed(2)} Cr
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full" 
              style={{ width: `${zoneAchievedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-3xs font-bold text-gray-500 mt-1">
            <span>{zoneAchievedPercent}% Quota Met</span>
            <span className="text-emerald-700 font-black">+16.8% YoY</span>
          </div>
        </button>

        {/* Card 2: Divisions under Zone */}
        <button
          onClick={() => setDrilldown('divisions')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
              Active Divisions
            </span>
            <Layers className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">3 Divisions</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-gray-500">
              Cardio-Diab, Gastro, Ortho
            </span>
            <span className="text-3xs font-extrabold text-indigo-600 group-hover:underline flex items-center">
              Breakdown <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 3: Total Stockists in Zone */}
        <button
          onClick={() => setDrilldown('stockists')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-amber-800 transition-colors">
              Zonal Stockist Network
            </span>
            <Building2 className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{metrics.totalStockistsInZone || 112} Stockists</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-amber-800">
              Zero Supply Stockout
            </span>
            <span className="text-3xs font-extrabold text-amber-700 group-hover:underline flex items-center">
              View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 4: Total Zonal Field Force */}
        <button
          onClick={() => setDrilldown('fieldforce')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-purple-700 transition-colors">
              Field Force
            </span>
            <Users className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-purple-950 mt-2">{user.teamSize || 84} Personnel</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-emerald-700 font-bold">
              4 RMs • 16 AMs • 64 MRs
            </span>
            <span className="text-3xs font-extrabold text-purple-600 group-hover:underline flex items-center">
              Strength <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Regional Matrix Table */}
      <div className="bg-white rounded-xl shadow-2xs p-5 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-700" />
              <span>North Zone Regional Quota Performance</span>
            </h2>
            <p className="text-xs text-gray-500">Comparative revenue analytics across UP East, UP West, Bihar & Delhi-NCR.</p>
          </div>
          <Link
            to="/reports"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            Detailed Regional Drilldown <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 text-3xs uppercase font-extrabold">
                <th className="py-2.5 px-3">Zone Region</th>
                <th className="py-2.5 px-3">Regional Manager (RM)</th>
                <th className="py-2.5 px-3">Monthly Target</th>
                <th className="py-2.5 px-3">Achieved Sales</th>
                <th className="py-2.5 px-3">Target %</th>
                <th className="py-2.5 px-3 text-right">Zone Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {regions.map((reg, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-gray-900">{reg.name}</td>
                  <td className="py-3 px-3 font-bold text-indigo-900">{reg.rmName}</td>
                  <td className="py-3 px-3 text-gray-600">₹{(reg.target / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3 font-black text-emerald-800">₹{(reg.achieved / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-emerald-600"
                          style={{ width: `${Math.min(reg.percent, 100)}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-gray-800">{reg.percent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Healthy Run-Rate
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
