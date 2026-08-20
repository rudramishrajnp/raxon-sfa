import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  CheckSquare, 
  TrendingUp, 
  ShoppingCart, 
  Navigation, 
  Clock, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Activity,
  Briefcase,
  Lock,
  Unlock,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile, getAllUsersByRole, resetUserPunchIn, getStoredUserProfiles } from '../../data/userContext';
import { getMyTeam } from '../../services/managerHierarchyService';
import { 
  AmActiveMrsModal, 
  AmCallsModal, 
  AmPobModal, 
  AmQuotaModal 
} from './DashboardDrilldownModals';

interface AMDashboardProps {
  user: UserProfile;
}

export function AMDashboard({ user }: AMDashboardProps) {
  const [drilldown, setDrilldown] = useState<'mrs' | 'calls' | 'pob' | 'quota' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [assignedMrTeam, setAssignedMrTeam] = useState<UserProfile[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      try {
        const team = await getMyTeam(user.id);
        if (!isMounted) return;
        const allProfiles = getStoredUserProfiles();
        if (team.length > 0) {
          const matched = team.map(t => {
            const found = allProfiles.find(p => p.id === t.userId);
            if (found) return found;
            return {
              id: t.userId,
              name: t.userName,
              role: 'MR',
              roleTitle: 'Medical Representative (MR)',
              companyId: user.companyId || 'comp-1',
              divisionId: t.divisionId,
              email: t.userEmail,
              phone: t.userPhone || '+91 98765 00000',
              hq: t.userHq || user.hq || 'Area HQ',
              territory: t.userHq || user.hq || 'Field Territory',
              status: t.status as any || 'active',
              initials: t.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
              metrics: {
                doctorsCount: 42,
                chemistsCount: 28,
                stockistsCount: 6,
                plannedCallsToday: 10,
                completedCallsToday: 8,
                pobBookedToday: 14500,
                monthlyTarget: 180000,
                monthlyAchieved: 155000,
                dcrStatus: 'submitted' as any,
                mtpStatus: 'approved' as any,
                isPunchedIn: true,
                punchInTime: '09:15 AM'
              }
            } as UserProfile;
          });
          setAssignedMrTeam(matched);
        } else {
          // Fallback to company MRs if no specific hierarchy configured yet
          const compMRs = getAllUsersByRole('MR', user.companyId);
          setAssignedMrTeam(compMRs);
        }
      } catch (err) {
        console.warn('Error fetching AM team:', err);
        setAssignedMrTeam(getAllUsersByRole('MR', user.companyId));
      }
    };

    fetchTeam();
    const handleHierarchyUpdate = () => fetchTeam();
    window.addEventListener('raxon-hierarchy-updated', handleHierarchyUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('raxon-hierarchy-updated', handleHierarchyUpdate);
    };
  }, [user.id, user.companyId, refreshTrigger]);

  const allMRs = assignedMrTeam;
  const metrics = user.metrics;

  const totalAreaPob = allMRs.reduce((acc, mr) => acc + (mr.metrics.pobBookedToday || 0), 0);
  const totalCallsDone = allMRs.reduce((acc, mr) => acc + (mr.metrics.completedCallsToday || 0), 0);
  const totalCallsPlanned = allMRs.reduce((acc, mr) => acc + (mr.metrics.plannedCallsToday || 8), 0);

  const monthlyTargetAchievedPercent = metrics.areaMonthlyTarget && metrics.areaMonthlyAchieved
    ? Math.round((metrics.areaMonthlyAchieved / metrics.areaMonthlyTarget) * 100)
    : 87;

  return (
    <div className="space-y-6">
      {/* Drilldown Modals */}
      <AmActiveMrsModal isOpen={drilldown === 'mrs'} onClose={() => setDrilldown(null)} />
      <AmCallsModal isOpen={drilldown === 'calls'} onClose={() => setDrilldown(null)} />
      <AmPobModal isOpen={drilldown === 'pob'} onClose={() => setDrilldown(null)} />
      <AmQuotaModal isOpen={drilldown === 'quota'} onClose={() => setDrilldown(null)} />

      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Area Manager (AM) Operations Command
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                Area Command Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-0.5">
              Welcome, <span className="text-blue-900 font-black">{user.name}</span> • Managing: <strong className="text-gray-900">{user.territory}</strong> ({user.hq})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <Link
            to="/tracking"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4" />
            Live MR Team GPS
          </Link>
          <Link
            to="/approvals"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            Approvals ({metrics.pendingMtpApprovals || 2})
          </Link>
        </div>
      </div>

      {/* AM Key Metric Cards (All Clickable with Rich Detail Modals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active MR Team */}
        <button
          onClick={() => setDrilldown('mrs')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-700 transition-colors">
              Area Field MRs
            </span>
            <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{allMRs.length} Active</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Punched In Today
            </span>
            <span className="text-3xs font-extrabold text-blue-600 group-hover:underline flex items-center">
              View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 2: Today's Area Calls Done */}
        <button
          onClick={() => setDrilldown('calls')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
              Today's Area Calls
            </span>
            <Activity className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-indigo-950 mt-2">
            {totalCallsDone} / {totalCallsPlanned}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-bold text-indigo-700 flex items-center gap-1">
              {Math.round((totalCallsDone / totalCallsPlanned) * 100)}% Daily Target Met
            </span>
            <span className="text-3xs font-extrabold text-indigo-600 group-hover:underline flex items-center">
              Logs <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 3: Area Today's POB Value */}
        <button
          onClick={() => setDrilldown('pob')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
              Today's Area POB
            </span>
            <ShoppingCart className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            ₹{totalAreaPob.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-gray-500">
              Across 4 Area Territories
            </span>
            <span className="text-3xs font-extrabold text-emerald-700 group-hover:underline flex items-center">
              Orders <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Card 4: Area Monthly Sales Target */}
        <button
          onClick={() => setDrilldown('quota')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-purple-700 transition-colors">
              Area Monthly Quota
            </span>
            <TrendingUp className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-purple-950">
              ₹{((metrics.areaMonthlyAchieved || 859800) / 100000).toFixed(2)}L
            </span>
            <span className="text-3xs text-gray-400 font-bold">
              / ₹{((metrics.areaMonthlyTarget || 990000) / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-purple-600 h-1.5 rounded-full" 
              style={{ width: `${monthlyTargetAchievedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-3xs font-bold text-gray-500 mt-1">
            <span>{monthlyTargetAchievedPercent}% Achieved</span>
            <span className="text-emerald-700 font-black">Top 3 in Region</span>
          </div>
        </button>
      </div>

      {/* Main Area View: Real-time MR Team Performance Table + Quick Area Action Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MR Team Status Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-2xs p-5 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Area MR Team Daily Performance ({allMRs.length} Reps)</span>
              </h2>
              <p className="text-xs text-gray-500">Live call coverage, doctor prescription feedback & POB orders.</p>
            </div>
            <Link
              to="/tracking"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Live GPS Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 text-3xs uppercase font-extrabold">
                  <th className="py-2.5 px-3">Field MR</th>
                  <th className="py-2.5 px-3">HQ / Territory Patch</th>
                  <th className="py-2.5 px-3">Calls Done</th>
                  <th className="py-2.5 px-3">POB Booked</th>
                  <th className="py-2.5 px-3">Live Status / GPS</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allMRs.map(mr => (
                  <tr key={mr.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${mr.avatarBg || 'bg-indigo-600'} text-white text-3xs font-black flex items-center justify-center`}>
                          {mr.initials}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900">{mr.name}</div>
                          <div className="text-3xs text-gray-500 font-semibold">{mr.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-800">{mr.metrics.currentPatchName || mr.territory}</div>
                      <div className="text-3xs text-gray-500">{mr.hq}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono">
                        {mr.metrics.completedCallsToday || 0}/{mr.metrics.plannedCallsToday || 8}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-emerald-700">
                      ₹{(mr.metrics.pobBookedToday || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      {mr.metrics?.punchInLocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-extrabold bg-red-100 text-red-800 border border-red-200">
                          <Lock className="w-2.5 h-2.5 shrink-0" />
                          Locked Out
                        </span>
                      ) : mr.metrics?.isPunchedIn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active in Field
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-extrabold bg-gray-100 text-gray-800">
                          Not Punched In
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {mr.metrics?.punchInLocked && (
                          <button
                            onClick={async () => {
                              await resetUserPunchIn(mr.id);
                              setRefreshTrigger(prev => prev + 1);
                            }}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-3xs font-black border border-amber-300 transition-colors flex items-center gap-1"
                            title="Reset & Unlock Punch-In"
                          >
                            <Unlock className="w-3 h-3" />
                            Reset Punch
                          </button>
                        )}
                        <Link
                          to="/tracking"
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-3xs font-extrabold border border-indigo-200 transition-colors"
                        >
                          Track GPS
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Action Panel: Pending Approvals & Joint Field Work */}
        <div className="space-y-4">
          {/* Pending Approvals Widget */}
          <div className="bg-white rounded-xl shadow-2xs p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>Pending Field Approvals</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-3xs">
                {metrics.pendingMtpApprovals || 2} Pending
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {allMRs.slice(0, 2).map((mr, idx) => (
                <div key={mr.id} className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-gray-900">{mr.name} ({mr.hq})</div>
                    <div className="text-3xs text-gray-600">{idx === 0 ? 'Next Month MTP Tour Schedule (26 Days)' : 'Chemist POB Order Special Discount Scheme'}</div>
                  </div>
                  <Link
                    to="/approvals"
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-3xs font-extrabold"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>

            <Link
              to="/approvals"
              className="mt-3 block text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-3xs border border-gray-200 transition-colors"
            >
              Open Approvals Manager →
            </Link>
          </div>

          {/* Joint Work Widget */}
          <div className="bg-white rounded-xl shadow-2xs p-5 border border-gray-200">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 mb-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Manager Joint Field Work</span>
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              You completed <strong>{metrics.jointCallsDoneThisMonth || 12} Joint Calls</strong> with field MRs this month.
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-3xs font-semibold text-blue-900">
              💡 <strong>Upcoming Joint Call:</strong> Tomorrow with <strong>{allMRs[0]?.name || 'Field Staff'}</strong> at Local Poly-clinics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
